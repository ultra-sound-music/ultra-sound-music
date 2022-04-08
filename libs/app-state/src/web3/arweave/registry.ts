import ArweaveClient from '@usm/arweave';

let arClient: ArweaveClient;

export function initArweave(logo?: string) {
  arClient = new ArweaveClient(logo);
  if (!arClient) {
    throw new Error('Arweave not initialized');
  }

  return arClient;
}

export function getArweave() {
  return arClient;
}
