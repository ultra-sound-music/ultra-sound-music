// The registry is technically state in that it keeps certain values in memory,
// however, these values are not really meant to be changing throughout the application lifecycle

import * as arweave from '@usm/arweave';
import { Arweave, ArweaveWallet, ArweaveClientConfigs } from '@usm/arweave';

let arClient: Arweave;
let arWallet: ArweaveWallet;

export async function initArweave(origin: ArweaveClientConfigs) {
  arClient = await arweave.initArweave(origin);
  if (!arClient) {
    throw new Error('Arweave not initialized');
  }

  return arClient;
}

export async function getArweave() {
  return arClient;
}

export function initArweaveWallet(appName: string, logo: string) {
  arWallet = arweave.initWallet({ name: appName, logo });
}

export function getArweaveWallet() {
  return arWallet;
}
