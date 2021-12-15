import { IWallet } from '@usm/wallets/types';
import logger from '@usm/utils/logger';

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
