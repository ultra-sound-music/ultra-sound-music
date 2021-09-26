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

const tokenConfigs = require('../conf/tokenConfigs.js');

const {
  artist: artistConfigs,
  band: bandConfigs,
  track: trackConfigs
} = tokenConfigs;

const sentryDsn =
  process.env.SENTRY_ENABLED === 'true' ? process.env.SENTRY_DSN : '';

const POLLING_TIMEOUT = 1000;
const POLLING_INTERVAL = 100;

const nullAddress = '0x0000000000000000000000000000000000000000';

// start express app
const app = express();
const port = 9001;

Sentry.init({
  dsn: sentryDsn,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
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
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => mongoose.connection.db.dropDatabase()
);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('open', console.log.bind(console, 'connected to db'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// support /post
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const handleArtistToken = async (from, to, id) => {
  console.log('handle artist being called');
  if (from === nullAddress) {
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
      description: metadata.description
    });

    await artist.save();
    Transaction.recordCompletedTransaction(
      Transaction.types.CREATE_ARTIST,
      to,
      metadataUri
    );
  }
};

const handleBandToken = async (id, artistId, owner) => {
  console.log('handling new band token id', id.toNumber());
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
};

const handleJoinBand = async (id, artistId, owner) => {
  console.log('handling join band id =', id.toNumber());

  const band = await Band.findOne({ tokenId: id.toNumber() });
  if (!band) {
    console.error(`Failed updating db. Band "${id}" was not found`);
    return;
  }

  console.log('band: ', band);
  const currMembers = band.members;
  currMembers.push(Number(artistId));
  band.members = currMembers;
  band.active = currMembers.length >= 2;
  await band.save();
  Transaction.recordCompletedTransaction(
    Transaction.types.JOIN_BAND,
    owner,
    band.metadataUri
  );
};

const handleTrackToken = async (trackId, bandId, artistId, owner) => {
  console.log('handling new Track');
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
  Transaction.recordCompletedTransaction(
    Transaction.types.CREATE_TRACK,
    owner,
    metadataUri
  );
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

async function getAllTokens() {
  const tracks = await Track.find();
  const bands = await Band.find();
  const artists = await Artist.find();

  return [].concat.apply([], [tracks, bands, artists]);
}

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

  const { publicUrl: metadataUri } = await fleekStorage.upload({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key: uuidv4(),
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

  trackContract.on('trackCreated', async (trackId, bandId, artistId, owner) => {
    await handleTrackToken(trackId, bandId, artistId, owner);
    console.log(`track was created by ${owner} id = ${artistId}`);
  });

  console.log(`Example app listening on port ${port}!`);
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
