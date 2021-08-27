import { ethers } from 'ethers';
import axios from 'axios';

const noop = () => {};

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
    const signer = provider.getSigner();

    this.apiHost = apiHost;
    this.accountAddress = accountAddress;
    this.provider = provider;
    this.logger = logger;
    this.signer = signer;
    this.artistWriteContract = new ethers.Contract(artistConfig.address, artistConfig.abi, signer);
    this.bandWriteContract = new ethers.Contract(bandConfig.address, bandConfig.abi, signer);
    this.trackWriteContract = new ethers.Contract(trackConfig.address, trackConfig.abi, signer);
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
    return await axios.get(`${this.apiHost}/tokens`, {
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
    };
    const { data } = await this.createMetadataUri(metadata);
    const transaction = await this.artistWriteContract.createArtist(data.metadataUri, {
      value: ethers.utils.parseEther('.15'),
    });
    this.artistWriteContract.once(transaction, (transaction) => onComplete({ transaction, data: metadata }))
    
    return transaction;
  }

  async startBand({ name, description, artistTid }, onComplete) {
    if (!name) {
      throw new Error('Missing required information');
    }

    if(!artistTid) {
      throw new Error('An artist is required when starting a band.');
    }

    const metadata = {
      name,
      description
    };

    const contextData = {
      artistTid,
      ...metadata
    }

    const { data } = await this.createMetadataUri(metadata);
    const transaction = await this.bandWriteContract.startBand(artistTid, data.metadataUri);    
    this.bandWriteContract.once(transaction, (transaction) => onComplete({ transaction, data: contextData }));

    return transaction;
  }

  async joinBand({ artistTid, bandTid }, onComplete) {
    const contextData = {
      artistTid,
      bandTid
    };

    const transaction = await this.bandWriteContract.joinBand(artistTid, bandTid);
    this.bandWriteContract.once(transaction, (transaction) => onComplete({ transaction, data: contextData }));
    return transaction;
  }

  async createTrack({ name, description, artistTid, bandTid }, onComplete) {
      const metadata = {
        name,
        description
      };

      const { data } = await this.createMetadataUri(metadata);
      const transaction = await this.trackWriteContract.createTrack(artistTid, bandTid, data.metadataUri);
      const contextData = {
        name,
        description,
        artistTid,
        bandTid
      };
      this.trackWriteContract.once(transaction, (transaction) => onComplete({ transaction, data: contextData }));
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