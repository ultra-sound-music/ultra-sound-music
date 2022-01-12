import { IWallet } from '@usm/wallets/types';

export interface ISolClientArgs {
  wallet: IWallet;
  accountAddress: string;
}

export default class SolClient {
  wallet: IWallet;
  accountAddress: string;

  constructor({ wallet, accountAddress }: ISolClientArgs) {
    this.wallet = wallet;
    this.accountAddress = accountAddress;
  }

  async fetchAll(): Promise<unknown> {
    return [];
  }
}
