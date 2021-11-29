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
    this.accountAddress = accountAddress;
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

  async fetchNewMints() {
    return await axios.get(`${this.apiHost}/api/mints`);
  }

  // Providing a pendingTransaction enables long polling on the server
  async fetchAll() {
    return await axios.get(`${this.apiHost}/api/tokens`);
  }

  async createArtist() {
    /** @TODO */
  }

  async startBand() {
    /** @TODO */
  }

  async joinBand() {
    /** @TODO */
  }

  async createTrack() {
    /** @TODO */
  }
}
