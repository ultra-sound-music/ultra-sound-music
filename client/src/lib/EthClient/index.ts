import { ethers } from 'ethers';

type TEthConstructorProps = {
  ethereum: Record<string, unknown>
}

const methods = {
  CONNECT_WALLET: 'eth_requestAccounts',
  GET_CHAIN_ID: 'eth_chainId'
}

export default class Eth {
  provider = null;
  isWeb3Available = false;
  ethereum = null;

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
  
    const accounts = await this.ethereum.request({ method: methods.CONNECT_WALLET });
    return accounts[0] ?? '';
  }

  async getWalletAddress(): Promise<string | null> {
    if (!this.provider) {
      return null;
    }
  
    const accounts = await this.provider.listAccounts();
    return accounts?.[0] ?? null;
  }

  async getChainId(): Promise<string> {
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
}
