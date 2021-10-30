require('dotenv').config();
const { ethers } = require('ethers');
const express = require('express');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Artist = require('./db/models/Artist');
const Track = require('./db/models/Track');
const Band = require('./db/models/Band');
const Transaction = require('./db/models/Transaction');
const fleekStorage = require('@fleekhq/fleek-storage-js');
const fetch = require('node-fetch');

const tokenConfigs = require('../conf/tokenConfigs');

const {
  artist: artistConfigs,
  band: bandConfigs,
  track: trackConfigs
} = tokenConfigs;

const sentryDsn =
  process.env.SENTRY_ENABLED === 'true' ? process.env.SENTRY_DSN : '';

const nullAddress = '0x0000000000000000000000000000000000000000';
const ARTIST_SOUND = 'artistSound';
const TRACK_SOUND = 'trackSound';
const POLLING_TIMEOUT = 1000;
const POLLING_INTERVAL = 100;

// start express app
const app = express();
const port = process.env.PORT || 9001;

Sentry.init({
  dsn: sentryDsn,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ]
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

const customHttpProvider = new ethers.providers.JsonRpcProvider(
  process.env.ETH_PROVIDER
);

let artistContract = new ethers.Contract(
  // TODO: improve next line
  artistConfigs.address,
  artistConfigs.abi,
  customHttpProvider
);

let bandContract = new ethers.Contract(
  // TODO: improve next line
  bandConfigs.address,
  bandConfigs.abi,
  customHttpProvider
);

let trackContract = new ethers.Contract(
  // TODO: improve next line
  trackConfigs.address,
  trackConfigs.abi,
  customHttpProvider
);

// connect to DB
mongoose.connect(
  process.env.MONGO_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  // only dump database when running locally
  process.env.ENV === 'local'
    ? () => mongoose.connection.db.dropDatabase()
    : null
);

//Get the default connectiona
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('open', console.log.bind(console, 'connected to db'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// support /post
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const generateMedia = async (data, metadata, mediaType) => {
  try {
    // call generative media server
    const {
      generatedAssets: { fleekWavUrl },
      fleekUpload: { ipfsHash },
      artistTraits
    } = await fetch(
      process.env.GENERATIVE_MEDIA_SERVER_ENDPOINT +
        `${
          mediaType === ARTIST_SOUND
            ? `/artist?`
            : mediaType === TRACK_SOUND
            ? '/track?'
            : ''
        }` +
        new URLSearchParams({
          a: data.dna,
          t: data.blockHash
        }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((data) => data.json());

    //update metadata object

    const soundUri = `https://ipfs.io/ipfs/` + ipfsHash;

    console.log(artistTraits);

    metadata.sound = soundUri;
    metadata.artistTraits = artistTraits;

    //upload updated metadata to IPFS

    await fleekStorage.upload({
      apiKey: process.env.FLEEK_API_KEY,
      apiSecret: process.env.FLEEK_API_SECRET,
      key: data.key,
      data: JSON.stringify(metadata)
    });

    // return s3 key an soundUri

    return { fleekWavUrl, soundUri, artistTraits };
  } catch (e) {
    process.env.ENV === 'local' ? console.log(e) : Sentry.captureException(e);
  }
};

const handleArtistToken = async (from, to, id) => {
  console.log('handle artist being called');

  try {
    if (from === nullAddress) {
      //filter for this transaction
      const artistFilter = artistContract.filters.Transfer(from, to, id);
      //get transaction logs for this transaction
      const [tx] = await artistContract.queryFilter(artistFilter, 0, 'latest');

      console.log('handling new artist token');
      const metadataUri = await artistContract.tokenURI(id);
      const metadata = await fetch(metadataUri).then((result) => result.json());
      const artist = new Artist({
        tokenId: id,
        artistDNA: metadata.artistDNA,
        owner: to,
        metadataUri,
        tokenType: 'artist',
        name: metadata.name,
        image: metadata.image,
        description: metadata.description
      });
      // save artist immediately so api data is updated
      await artist.save();
      //generate media get s3Key and ipfs uri back
      const { fleekWavUrl, soundUri, artistTraits } = await generateMedia(
        { dna: to, blockHash: tx.blockHash, key: metadata.key },
        metadata,
        ARTIST_SOUND
      );

      //upate artist in db/api with sound data
      artist.s3Sound = fleekWavUrl;
      artist.soundIpfs = soundUri;
      artist.artistTraits = artistTraits;
      await artist.save();
      Transaction.recordCompletedTransaction(
        Transaction.types.CREATE_ARTIST,
        to,
        metadataUri
      );
    }
  } catch (e) {
    process.env.ENV === 'local' ? console.log(e) : Sentry.captureException(e);
  }
};

const handleBandToken = async (id, artistId, owner) => {
  console.log('handling new band token id', id.toNumber());
  try {
    //const metadataUri = await contract.uri(id)
    const metadataUri = await bandContract.tokenURI(id);
    const metadata = await fetch(metadataUri).then((result) => result.json());
    const band = new Band({
      tokenId: id.toNumber(),
      creator: Number(artistId),
      owner,
      metadataUri,
      members: [Number(artistId)],
      active: false,
      tokenType: 'band',
      name: metadata.name,
      description: metadata.description
    });

    await band.save();
    Transaction.recordCompletedTransaction(
      Transaction.types.START_BAND,
      owner,
      metadataUri
    );
  } catch (e) {
    process.env.ENV === 'local' ? console.log(e) : Sentry.captureException(e);
  }
};

const handleJoinBand = async (id, artistId, owner) => {
  console.log('handling join band id =', id.toNumber());
  try {
    const band = await Band.findOne({ tokenId: id.toNumber() });
    if (!band) {
      console.error(`Failed updating db. Band "${id}" was not found`);
      return;
    }

    console.log('band: ', band);
    const currMembers = band.members;
    currMembers.push(Number(artistId));
    band.members = currMembers;
    band.active = currMembers.length >= 2 ? true : false;
    await band.save();
    Transaction.recordCompletedTransaction(
      Transaction.types.JOIN_BAND,
      owner,
      band.metadataUri
    );
  } catch (e) {
    process.env.ENV === 'local' ? console.log(e) : Sentry.captureException(e);
  }
};

const handleTrackToken = async (trackId, bandId, artistId, owner) => {
  console.log('handling new Track');

  try {
    //filter for this transaction
    const trackFilter = trackContract.filters.trackCreated(
      trackId,
      bandId,
      artistId,
      owner
    );
    //get transaction logs for this transaction
    const [tx] = await trackContract.queryFilter(trackFilter, 0, 'latest');

    //get band to send members array to media server
    const band = await Band.findOne({ tokenId: bandId.toNumber() });

    const metadataUri = await trackContract.tokenURI(trackId);
    const metadata = await fetch(metadataUri).then((result) => result.json());
    const track = new Track({
      tokenId: trackId,
      creator: Number(artistId),
      owner,
      metadataUri,
      band: bandId,
      tokenType: 'track',
      name: metadata.name,
      description: metadata.description
    });

    await track.save();
    //generate media get s3Key and ipfs uri back
    const { s3Key, soundUri } = await generateMedia(
      { dna: band.members, blockHash: tx.blockHash },
      metadata,
      TRACK_SOUND
    );
    //upate artist in db/api with sound data
    track.s3Sound = s3Key;
    track.soundIpfs = soundUri;
    await track.save();
    Transaction.recordCompletedTransaction(
      Transaction.types.CREATE_TRACK,
      owner,
      band.metadataUri
    );
  } catch (e) {
    process.env.ENV === 'local' ? console.log(e) : Sentry.captureException(e);
  }
};

async function waitForTransactionsToComplete({ type, owner, tokenKey }) {
  // Have to use a promise instead of `async` because of the `setInterval`
  return new Promise((resolve, reject) => {
    const query = {
      type,
      owner,
      tokenKey,
      status: {
        $nin: [Transaction.status.EXPIRED, Transaction.status.COMPLETE]
      }
    };

    Transaction.findOne(query, (error, pendingTransaction) => {
      if (error) {
        reject(error);
      }

      if (!pendingTransaction) {
        resolve();
        return;
      }

      let elapsedTime = 0;
      const id = setInterval(() => {
        Transaction.findOne(query, (error, pendingTransaction) => {
          if (error) {
            reject(error);
          }

          elapsedTime = elapsedTime + POLLING_INTERVAL;
          if (elapsedTime > POLLING_TIMEOUT) {
            clearInterval(id);
            reject(
              new Error(
                `Timed out waiting for transaction to complete. type: ${type}, owner: ${owner}, tokenKey: ${tokenKey}`
              )
            );
          }

          if (!pendingTransaction) {
            clearInterval(id);
            resolve();
          }
        });
      }, POLLING_INTERVAL);
    });
  });
}

app.get('/', (req, res) => {
  res.send({ status: 'usm-api-online' });
});

app.get('/api/artists', async (req, res) => {
  const artists = await Artist.find();
  res.send(artists);
});

app.get('/api/bands', async (req, res) => {
  const bands = await Band.find();
  res.send(bands);
});

app.get('/api/tracks', async (req, res) => {
  const tracks = await Track.find();
  res.send(tracks);
});

const getAllTokens = async () => {
  try {
    const tracks = await Track.find();
    const bands = await Band.find();
    const artists = await Artist.find();

    return [].concat.apply([], [tracks, bands, artists]);
  } catch (e) {
    process.env.ENV === 'local' ? console.log(e) : Sentry.captureException(e);
  }
};

app.get('/api/tokens', async (req, res) => {
  const type = req.query?.pendingType;
  const pendingMetadataUri = req.query?.pendingMetadataUri;
  let metadataUri;
  if (pendingMetadataUri) {
    metadataUri = decodeURIComponent(pendingMetadataUri);
  }
  const owner = req.headers?.['x-owner'];
  if (owner && (type || metadataUri)) {
    try {
      const tokenKey = Transaction.generateTokenKey(metadataUri);
      await waitForTransactionsToComplete({ type, owner, tokenKey });
      console.info(
        `${type} transaction by ${owner} is complete (tokenKey: ${tokenKey})`
      );
    } catch (error) {
      console.log(error);
    }
  }

  const tokens = await getAllTokens();
  res.send(tokens);
});

app.post('/api/create_metadata_uri', async (req, res) => {
  const { metadata, options } = req.body;
  const transactionType = options?.transactionType;
  const owner = req.headers?.['x-owner'];
  const key = uuidv4();
  metadata.key = key;

  const { publicUrl: metadataUri } = await fleekStorage.upload({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key: key,
    data: JSON.stringify(metadata)
  });

  try {
    Transaction.recordSubmittedTransaction(transactionType, owner, metadataUri);
  } catch (error) {
    console.error(error);
  }

  if (!metadataUri) {
    res.status(500).send(new Error('Failed to generate metadata'));
  }

  res.send({ metadataUri });
});

app.put('/api/record_transaction', async (req, res) => {
  const owner = req?.headers?.['x-owner'];
  if (owner) {
    const type = req?.body?.transactionType;
    const tokenId = req?.body?.tokenId;
    if (type === Transaction.types.JOIN_BAND) {
      try {
        const band = await Band.findOne({ tokenId });
        Transaction.recordSubmittedTransaction(type, owner, band.metadataUri);
        res.send({ metadataUri: band.metadataUri });
      } catch (error) {
        console.log(error);
        res.status(500).send(new Error('Failed to record transaction'));
        return;
      }
    } else {
      res
        .status(400)
        .send(
          new Error(
            `Only "${Transaction.types.JOIN_BAND}" transaction type is supported`
          )
        );
      return;
    }
  }

  res.status(401).send();
});

app.listen(port, async () => {
  try {
    artistContract.on('Transfer', async (from, to, tokenId) => {
      await handleArtistToken(from, to, tokenId);
      console.log(`artist token id = ${tokenId} transfered`);
    });

    bandContract.on('bandCreate', async (id, artistId, owner) => {
      await handleBandToken(id, artistId, owner);
      console.log(`band token id = ${id} created`);
    });

    bandContract.on('bandJoined', async (id, artistId, owner) => {
      await handleJoinBand(id, artistId, owner);
      console.log(`band was joined by ${owner} id = ${id}`);
    });

    trackContract.on(
      'trackCreated',
      async (trackId, bandId, artistId, owner) => {
        await handleTrackToken(trackId, bandId, artistId, owner);
        console.log(`track was created by ${owner} id = ${artistId}`);
      }
    );

    console.log(`USM app listening on port ${port}!`);
  } catch (e) {
    process.env.ENV === 'local' ? console.log(e) : Sentry.captureException(e);
  }
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
