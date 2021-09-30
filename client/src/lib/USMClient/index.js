import { ethers } from 'ethers';
import axios from 'axios';

const noop = () => {
  console.log('TODO');
};

export default class USMClient {
  constructor({
    artistConfig,
    bandConfig,
    trackConfig,
    apiHost,
    accountAddress,
    provider,
    logger = {
      info: noop,
      error: noop
    }
  }) {
    this.apiHost = apiHost;
    this.updateAccount({ accountAddress });
    this.logger = logger;

    if (!provider) {
      return;
    }

    const signer = provider.getSigner();

    this.artistWriteContract = new ethers.Contract(
      artistConfig.address,
      artistConfig.abi,
      signer
    );
    this.bandWriteContract = new ethers.Contract(
      bandConfig.address,
      bandConfig.abi,
      signer
    );
    this.trackWriteContract = new ethers.Contract(
      trackConfig.address,
      trackConfig.abi,
      signer
    );
  }

  updateAccount({ accountAddress }) {
    this.accountAddress = accountAddress;
    if (accountAddress) {
      axios.defaults.headers.common['x-owner'] = accountAddress;
    } else {
      axios.defaults.headers.common['x-owner'] = null;
    }
  }

  ensureConnectionToContract(name) {
    if (!this[`${name}WriteContract`]) {
      throw new Error(`Connection to ${name} contract not established`);
    }
  }

  async createMetadataUri({ metadata, options }) {
    return axios.post(`${this.apiHost}/api/create_metadata_uri`, {
      metadata,
      options
    });
  }

  async recordTransaction({ transactionType, tokenId }) {
    return axios.put(`${this.apiHost}/api/record_transaction`, {
      transactionType,
      tokenId
    });
  }

  // Providing a pendingTransaction enables long polling on the server
  async fetchAll({ pendingTransaction } = {}) {
    const pendingType = pendingTransaction?.type;
    const metadataUri = pendingTransaction?.metadataUri;
    let pendingMetadataUri;
    if (metadataUri) {
      pendingMetadataUri = encodeURIComponent(metadataUri);
    }

    return await axios.get(`${this.apiHost}/api/tokens`, {
      params: { pendingType, pendingMetadataUri }
    });
  }

  // @TODO pass in an onError callback
  async createArtist(onComplete) {
    this.ensureConnectionToContract('artist');

    const metadata = {
      artistDNA: this.accountAddress
    };

    const options = {
      transactionType: 'create-artist'
    };

    const { data } = await this.createMetadataUri({ metadata, options });
    const transaction = await this.artistWriteContract.createArtist(
      data?.metadataUri,
      {
        value: ethers.utils.parseEther('.15')
      }
    );
    this.artistWriteContract.once(transaction, (transaction) =>
      onComplete({ transaction, data: metadata })
    );

    return transaction;
  }

  async startBand({ name, description, artistTid }, onComplete) {
    this.ensureConnectionToContract('band');

    if (!artistTid) {
      throw new Error('An artist is required when starting a band.');
    }

    const metadata = {
      name,
      description
    };

    const contextData = {
      artistTid,
      ...metadata
    };

    const options = {
      transactionType: 'start-band'
    };

    const { data } = await this.createMetadataUri({ metadata, options });
    const transaction = await this.bandWriteContract.startBand(
      artistTid,
      data.metadataUri
    );
    this.bandWriteContract.once(transaction, (transaction) =>
      onComplete({ transaction, data: contextData })
    );
    return transaction;
  }

  async joinBand({ artistTid, bandTid }, onComplete) {
    this.ensureConnectionToContract('band');

    let response;
    try {
      response = await this.recordTransaction({
        transactionType: 'join-band',
        tokenId: bandTid
      });
    } catch (error) {
      // We weren't able to record the transaction - not a big deal but this means we may
      // face a race condition between the db and the contract when updating the ui
      this.logger.error(error);
    }

    const metadataUri = response?.data?.metadataUri ?? '';
    const data = { metadataUri, artistTid, bandTid };

    const transaction = await this.bandWriteContract.joinBand(
      artistTid,
      bandTid
    );
    this.bandWriteContract.once(transaction, (transaction) =>
      onComplete({ transaction, data })
    );
    return transaction;
  }

  async createTrack({ name, description, artistTid, bandTid }, onComplete) {
    this.ensureConnectionToContract('track');

    const metadata = {
      name,
      description
    };

    const options = {
      transactionType: 'create-track'
    };

    const { data } = await this.createMetadataUri({ metadata, options });
    const metadataUri = data?.metadataUri;
    const transaction = await this.trackWriteContract.createTrack(
      artistTid,
      bandTid,
      metadataUri
    );
    const contextData = {
      name,
      description,
      metadataUri,
      artistTid,
      bandTid
    };
    this.trackWriteContract.once(transaction, (transaction) =>
      onComplete({ transaction, data: contextData })
    );
    return transaction;
  }
}
