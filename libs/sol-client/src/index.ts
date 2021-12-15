import { IWallet } from '@usm/wallets/types';
import logger from '@usm/utils/logger';

export interface ISolClientArgs {
  solClient: IWallet;
  accountAddress: string;
}

export default class SolClient {
  solClient: IWallet;
  accountAddress: string;

  constructor({ solClient, accountAddress }: ISolClientArgs) {
    this.solClient = solClient;
    this.accountAddress = accountAddress;
  }

  async fetchAll(): Promise<unknown> {
    return [];
  }
}
