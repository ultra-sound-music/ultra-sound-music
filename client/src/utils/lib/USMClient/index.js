import { ethers } from 'ethers';
import axios from 'axios';

const noop = () => {};

export default class USMClient {
  constructor({
    contractAddress,
    abi,
    apiHost,
    currentAccountAddress,
    provider,
    logger = {
      info: noop,
      error: noop
    }
  }) { 
    const signer = provider.getSigner();

    this.apiHost = apiHost;
    this.currentAccountAddress = currentAccountAddress;
    this.provider = provider;
    this.logger = logger;
    this.signer = signer;
    this.writeContract = new ethers.Contract(contractAddress, abi, signer);
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
    const response = await axios.get(`${this.apiHost}/cache/tokens/all`, {
      headers: {"Access-Control-Allow-Origin": "*"}
    });

    return response?.data;
  }

  async createArtist({ name, description }, onComplete) {
    if (!name || !description) {
      throw new Error('Missing required information');
    }

    const metadata = {
      name,
      description,
      artistDNA: this.currentAccountAddress
    }
    const { data } = await this.createMetadataUri(metadata);
    const transaction = await this.writeContract.createArtist(data.metadataUri);
    this.writeContract.once(transaction, (transaction) => onComplete({ transaction, metadata}))
    
    return transaction;
  }

  createBand() {

  }

  joinBand() {

  }

  createTrack() {

  }

  inviteToJoinBand() {
    // @todo - state for this should go in IPS - but how would IPFS communicate with the blockchain
  }

  requestToJoinBand() {
    // @todo - state for this should go in IPS - but how would IPFS communicate with the blockchain
  }

  messageArtist(tokenId) {
    // @todo is there any way to implement a message streaming system over ethereum?
  }

  messageBand(tokenId) {
    // @todo is there any way to implement a message streaming system over ethereum?
  }
}