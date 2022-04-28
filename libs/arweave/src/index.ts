import Arweave from 'arweave';

export * from './upload';
export * from './loadWalletData';
export * from './wallet';
export * from './types';

export { Arweave };

export interface ArweaveClientConfigs {
  protocol: string;
  host: string;
  port: string;
}

export async function initArweave(configs: ArweaveClientConfigs) {
  return Arweave.init({
    protocol: configs.protocol,
    host: configs.host,
    port: configs.port
  });
}
