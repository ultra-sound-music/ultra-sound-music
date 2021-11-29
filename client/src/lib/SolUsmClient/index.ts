export interface ISolUsmClientArgs {
  solClient: Record<string, unknown>;
  accountAddress: string;
  logger: Record<string, unknown>;
}

export default class SolUsmClient {
  solClient = null;
  accountAddress = null;
  logger = null;

  constructor({ solClient, accountAddress, logger }: ISolUsmClientArgs) {
    this.solClient = solClient;
    this.accountAddress = accountAddress;
    this.logger = logger;
  }

  async fetchAll(): Promise<unknown> {
    return [];
  }
}
