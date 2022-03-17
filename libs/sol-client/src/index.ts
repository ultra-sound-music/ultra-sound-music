import {
  getWalletAdapter,
  defaultWalletName,
  IWalletName,
  IPubKeyString,
  INetworkId,
  IWallet
} from './wallets';
import { Adapter, WalletAdapterEvents } from '@solana/wallet-adapter-base';
import { PublicKey } from '@usm/auction';

export type IWalletAdapterEvents = keyof WalletAdapterEvents;

function waitForWallet(wallet: Adapter): Promise<string> {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const key = wallet.publicKey as PublicKey;

      if (key) {
        clearInterval(intervalId);
        resolve(key && key !== PublicKey.default ? key.toString() : '');
      }
    }, 30);

    setTimeout(() => {
      resolve('');
      clearInterval(intervalId);
    }, 2000);
  });
}

export default class SolClient implements IWallet {
  isWeb3Available = false;
  walletName: string;
  walletUrl: string;
  walletIcon: string;
  wallet: Adapter;

  constructor(walletName: IWalletName = defaultWalletName) {
    const config = {};
    const walletAdapter = getWalletAdapter(walletName, config);
    const wallet = walletAdapter.adapter;

    this.isWeb3Available = !!wallet;
    this.walletName = walletName;
    this.walletUrl = walletAdapter.url;
    this.walletIcon = walletAdapter.icon;
    this.wallet = wallet;
  }

  async init(): Promise<string> {
    if (!this.isWeb3Available) {
      return '';
    }

    return await this.connectWallet();
  }

  async connectWallet(): Promise<string> {
    if (!this.wallet) {
      return '';
    }

    await this.wallet.connect();

    // @TODO - there's a bug where the wallet address can be null for a second even after the wallet connects
    await waitForWallet(this.wallet);

    const newAddress = await this.getWalletAddress();
    return newAddress;
  }

  async disconnectWallet(): Promise<void> {
    await this.wallet.disconnect();
  }

  async getWalletAddress(): Promise<IPubKeyString> {
    if (!this.wallet) {
      return '';
    }

    const key = this.wallet.publicKey as PublicKey;
    return key && key !== PublicKey.default ? key.toString() : '';
  }

  async getNetworkId(): Promise<INetworkId> {
    return 0;
  }

  isConnected(): boolean {
    return !!this.wallet && !!this.wallet.connected;
  }

  async mint(): Promise<string> {
    return '';
  }

  on(eventName: IWalletAdapterEvents, eventHandler: () => void): void {
    this.wallet.on(eventName, eventHandler);
  }

  off(eventName: IWalletAdapterEvents, eventHandler: () => void): void {
    this.wallet.off(eventName, eventHandler);
  }
}
