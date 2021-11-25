import { IPubKeyString, INetworkId, IWeb3Client } from '../Web3Client';

export const DEFAULT_PUBLIC_KEY = '';

export function getProvider(): Record<string, unknown> {
  return {};
}

export default class SolClient implements IWeb3Client {
  isWeb3Available = false;
  providerConfig = null;
  provider = null;
  solana = null;

  constructor() {
    const provider = getProvider();
    this.provider = provider;
    this.isWeb3Available = !!provider;
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) {
      return '';
    }

    await this.provider.connect();
    return this.getWalletAddress();
  }

  async getWalletAddress(): Promise<IPubKeyString | null> {
    if (!this.provider) {
      return null;
    }

    const key = this.provider.publicKey;
    return key === DEFAULT_PUBLIC_KEY ? null : key.toString();
  }

  async getNetworkId(): Promise<INetworkId> {
    return 0;
  }

  async isConnected(): Promise<boolean> {
    return !!this.provider && !!this.provider.connected;
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
