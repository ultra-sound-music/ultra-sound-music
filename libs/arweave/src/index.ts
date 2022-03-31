import { ArweaveWebWallet } from 'arweave-wallet-connector';

export type IArweaveWalletEvents = 'connect' | 'disconnect';

const defaultARImage = 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg';

export class ArweaveClient {
  wallet;

  constructor(logo: string = defaultARImage) {
    this.wallet = new ArweaveWebWallet(
      {
        name: 'Guillermo Upload Client',
        logo
      },
      'arweave.app'
    );
  }

  async connect() {
    const { wallet } = this;

    wallet.on('change', (address) => {
      if (!address) {
        this.onDisconnected();
      } else {
        this.onConnected(address);
      }
    });

    return await wallet.connect();
  }

  disconnect() {
    return this.wallet.disconnect();
  }

  onDisconnected() {}

  onConnected(address: string): void {}

  off(eventName: IArweaveWalletEvents, eventHandler: () => void): void {
    this.wallet.off(eventName, eventHandler);
  }
}

export default ArweaveClient;
