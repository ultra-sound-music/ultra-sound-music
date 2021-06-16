import { ethers } from 'ethers';
import axios from 'axios';
import { debug } from '../../logger';

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

  async createMetaDataUri({
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

  async createArtist({ name, description }) {
    // if (!name || !description) {
    //   throw new Error('Missing required information')
    // }

    const { data } = await this.createMetaDataUri({
      name,
      description,
      artistDNA: this.currentAccountAddress
    });

    const transactionId = await this.writeContract.createArtist(data.metadataUri);

    
    let onCompleteCallback;
    // Not sure if its better bind listeners on the contract or on the provider...gonna go with contract for now...
    this.writeContract.once(transactionId, (transaction) => {
      onCompleteCallback(transaction)
    })
    
    return {
      transactionId,
      onComplete: (fn) => onCompleteCallback = fn
    }

    // @Todo abstract this and share it across all write operations
//     let onApprovedCallback;
//     let onCompleteCallback;
//     return (resolve, reject) => {
// debugger;
//     }

    // return new Promise((resolve, reject) => {
    //   this.listenForTransactionUpdate(txid, 'approved', onApprovedCallback, reject);
    //   this.listenForTransactionUpdate(txid, 'complete', onCompleteCallback, reject);

    //   resolve({
    //     txid, 
    //     onApprovedCallback: (fn) => onApprovedCallback = fn,
    //     onCompleteCallback: (fn) => onCompleteCallback = fn
    //   });
    // });
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