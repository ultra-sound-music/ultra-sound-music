import {
  getWalletAdapter,
  detaultWalletName,
  IWalletName,
  IPubKeyString,
  INetworkId,
  IWallet
} from './wallets';
import { Adapter, WalletAdapterEvents } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
export * from './auction';
export * from './utils/utils';

export function isValidSolanaAddress(address: string): boolean {
  return !!address;
}

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
      clearInterval(intervalId)
    }, 2000);
  });    
}

export default class SolClient implements IWallet {
  isWeb3Available = false;
  walletName: string;
  walletUrl: string;
  walletIcon: string;
  wallet: Adapter;

  constructor(walletName: IWalletName = detaultWalletName) {
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
    return await this.getWalletAddress();
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

  async isConnected(): Promise<boolean> {
    return !!this.wallet && !!this.wallet.connected;
  }

  async mint(): Promise<string> {
    return '';
  }

  on(eventName: keyof WalletAdapterEvents, eventHandler: () => void): void {
    this.wallet.on(eventName, eventHandler);
  }

  off(eventName: keyof WalletAdapterEvents, eventHandler: () => void): void {
    this.wallet.off(eventName, eventHandler);
  }
}
