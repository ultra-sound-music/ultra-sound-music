import { Wallet } from '@solana/wallet-adapter-base';

import {
  getLedgerWallet,
  getMathWallet,  
  getPhantomWallet,
  getSolflareWallet,
  getSolflareWebWallet,
  getSolletWallet,
  getSolletExtensionWallet,
  getTorusWallet,
} from '@solana/wallet-adapter-wallets';

export const walletsMap = {
  Ledger: getLedgerWallet,
  MathWallet: getMathWallet,
  Phantom: getPhantomWallet,
  Solflare: getSolflareWallet,
  SolflareWeb: getSolflareWebWallet,
  Sollet: getSolletWallet,
  SolletExtension: getSolletExtensionWallet,
  Torus: getTorusWallet,
};

export type IWalletName = keyof typeof walletsMap;
export const detaultWalletName: IWalletName = 'Phantom';

export const supportedWallets = Object.keys(walletsMap);

export function getWalletAdapter(
  walletName: IWalletName,
  config?: Record<string, unknown>
): Wallet {
  const createAdapter = walletsMap[walletName];
  return createAdapter(config);
}
