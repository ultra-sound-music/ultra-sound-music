import { ArweaveWebWallet, AppInfo } from 'arweave-wallet-connector';
import { ArweaveWallet } from './types';

// @TODO - do we need this?
// const defaultARImage = 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg';

export function initWallet(appInfo: AppInfo) {
  const webWallet = new ArweaveWebWallet(appInfo, 'arweave.app');
  return webWallet.namespaces.arweaveWallet;
}

export async function connect(wallet: ArweaveWallet) {
  return await wallet.connect();
}

export async function disconnect(wallet: ArweaveWallet) {
  return await wallet.disconnect();
}
