import { ArweaveWebWallet, AppInfo } from 'arweave-wallet-connector';
import { ArweaveWallet } from './types';

// @TODO - do we need this?
// const defaultARImage = 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg';

export function initWallet(appInfo: AppInfo) {
  const webWallet = new ArweaveWebWallet(appInfo, 'arweave.app');

  function onChange(address?: string) {
    if (!address) {
      // this.onDisconnected();
    } else {
      // this.onConnected(address);
    }
  }

  webWallet.on('change', onChange);
  return webWallet.namespaces.arweaveWallet;
}

export async function connect(wallet: ArweaveWallet) {
  return await wallet.connect();
}

export async function disconnect(wallet: ArweaveWallet) {
  return wallet.disconnect();
}
