import { ethers } from 'ethers';
import axios from 'axios';

const noop = () => {};

export default class USMClient {
  constructor({
    contractAddress,
    abi,
    apiHost,
    accountAddress,
    provider,
    logger = {
      info: noop,
      error: noop
    }
  }) { 
    const signer = provider.getSigner();

    this.apiHost = apiHost;
    this.accountAddress = accountAddress;
    this.provider = provider;
    this.logger = logger;
    this.signer = signer;
    this.writeContract = new ethers.Contract(contractAddress, abi, signer);
  }

  updateAccount({ accountAddress }) {
    this.accountAddress = accountAddress;
  }

  async createMetadataUri({
    name,
    description,
    artistDNA
  }) {
    return axios.post(`${this.apiHost}/create_metadata_uri`, {
      name,
      description,
      artistDNA
    }, {
      headers: {"Access-Control-Allow-Origin": "*"}
    });
  }
  
  
  async fetchAll() {
    return await axios.get(`${this.apiHost}/api/tokens`, {
      headers: {"Access-Control-Allow-Origin": "*"}
    });
  }

  // @TODO pass in an onError callback
  async createArtist({ name, description }, onComplete) {
    if (!name) {
      throw new Error('Missing required information');
    }

    const metadata = {
      name,
      description,
      artistDNA: this.accountAddress
    }
    const { data } = await this.createMetadataUri(metadata);
    const transaction = await this.writeContract.createArtist(data.metadataUri);
    this.writeContract.once(transaction, (transaction) => onComplete({ transaction, data: metadata }))
    
    return transaction;
  }

  // @TODO pass in an onError callback
  async startBand({ name, description, bandLeaderArtistId }, onComplete) {
    if (!name) {
      throw new Error('Missing required information');
    }

    if(!bandLeaderArtistId) {
      throw new Error('A band leader is required when starting a band.');
    }

    const metadata = {
      name,
      description
    };

    const { data } = await this.createMetadataUri(metadata);
    const transaction = await this.writeContract.startBand(bandLeaderArtistId, data.metadataUri);    
    this.writeContract.once(transaction, (transaction) => onComplete({ transaction, data: metadata }))

    return transaction;
  }

  async joinBand({ artistId, bandId }, onComplete) {
    const contextData = {
      artistId,
      bandId
    };

    const transaction = await this.writeContract.joinBand(artistId, bandId);
    this.writeContract.once(transaction, (transaction) => onComplete({ transaction, data: contextData }));
    return transaction;
  }

  async createTrack({ name, description, artistId, bandId }, onComplete) {
      const metadata = {
        name,
        description
      };

      const { data } = await this.createMetadataUri(metadata);
      const transaction = await this.writeContract.createTrack(artistId, bandId, data.metadataUri);
      const contextData = {
        name,
        description,
        artistId,
        bandId
      };
      this.writeContract.once(transaction, (transaction) => onComplete({ transaction, data: contextData }));
      return transaction;
  }

  inviteToJoinBand() {
    // @todo - state for this should go in IPS - but how would IPFS communicate with the blockchain
  }

  requestToJoinBand() {
    // @todo - state for this should go in IPS - but how would IPFS communicate with the blockchain
  }

  messageArtist() {
    // @todo is there any way to implement a message streaming system over ethereum?
  }

  messageBand() {
    // @todo is there any way to implement a message streaming system over ethereum?
  }
}