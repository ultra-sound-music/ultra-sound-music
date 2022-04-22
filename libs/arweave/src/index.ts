import Arweave from 'arweave';
import configs from '@usm/config';

export * from './upload';
export * from './loadWalletData';
export * from './wallet';
export * from './types';

export { Arweave };

export async function initArweave() {
  return Arweave.init({
    host: configs.arweaveHost,
    port: configs.arweavePort,
    protocol: configs.arweaveProtocol
  });
}
