import { IPubKeyString, INetworkId, IWeb3Client } from '../Web3Client';

export const DEFAULT_PUBLIC_KEY = '';

export function getWallet(): Record<string, unknown> {
  return {};
}

export default class SolClient implements IWeb3Client {
  isWeb3Available = false;
  walletConfig = null;
  wallet = null;
  solana = null;

  constructor() {
    const wallet = getWallet();
    this.wallet = wallet;
    this.isWeb3Available = !!wallet;
  }

  async connectWallet(): Promise<string> {
    if (!this.wallet) {
      return '';
    }

    await this.wallet.connect();
    return this.getWalletAddress();
  }

  async getWalletAddress(): Promise<IPubKeyString | null> {
    if (!this.wallet) {
      return null;
    }

    const key = this.wallet.publicKey;
    return key === DEFAULT_PUBLIC_KEY ? null : key.toString();
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

  onAccountChanged(): void {
    /** @TODO */
  }

  onChangedNetwork(): void {
    /** @TODO */
  }
}
