import { ethers } from 'ethers';

import { INetworkId, IWeb3Client } from '../Web3Client';

type TEthConstructorProps = {
  ethereum: Record<string, unknown>;
};

const methods = {
  CONNECT_WALLET: 'eth_requestAccounts',
  GET_CHAIN_ID: 'eth_chainId'
};

const validProductionChainIds = {
  MAINNET: 1
};

const validTestChainIds = {
  RINKEBY: 4,
  LOCAL: 31337
};

export default class EthClient implements IWeb3Client {
  isWeb3Available = false;
  provider: ethers.providers.Web3Provider | null = null;
  ethereum: ethers.providers.ExternalProvider | null = null;

  constructor({ ethereum }: TEthConstructorProps) {
    this.ethereum = ethereum;
    this.isWeb3Available = !!ethereum;
  }

  async init(): Promise<string | null> {
    if (!this.isWeb3Available) {
      return null;
    }

    this.provider = new ethers.providers.Web3Provider(this.ethereum);
    return this.getWalletAddress();
  }

  async connectWallet(): Promise<string> {
    if (!this.ethereum) {
      return '';
    }

    const accounts = await this.ethereum.request({
      method: methods.CONNECT_WALLET
    });
    return accounts[0] ?? '';
  }

  async getWalletAddress(): Promise<string | null> {
    if (!this.provider) {
      return null;
    }

    const accounts = await this.provider.listAccounts();
    return accounts?.[0] ?? null;
  }

  async getNetworkId(): Promise<string> {
    if (!this.ethereum) {
      return '';
    }

    return this.ethereum.request({ method: methods.GET_CHAIN_ID });
  }

  async isConnected(): Promise<boolean> {
    if (!this.provider) {
      return false;
    }

    return !!this.getWalletAddress();
  }

  async mint() {
    /** @TODO */
  }

  onAccountChanged(): void {
    /** @TODO */
  }

  onChangedNetwork(): void {
    /** @TODO */
  }
}

export function isValidTestNetworkId(networkId: INetworkId): boolean {
  return Object.values(validTestChainIds).includes(networkId);
}

export function isValidProductionNetworkId(networkId: INetworkId): boolean {
  return Object.values(validProductionChainIds).includes(networkId);
}
