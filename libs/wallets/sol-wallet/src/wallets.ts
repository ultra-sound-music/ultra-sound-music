import {
  Wallet,
  WalletName,  
} from '@solana/wallet-adapter-base';

import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolflareWebWallet,
  getSolletWallet,
  getSolletExtensionWallet,
  getTorusWallet
} from '@solana/wallet-adapter-wallets';

export type IWalletName = WalletName;

export const detaultWalletName = 'Phantom' as IWalletName;

export const walletsMap = {
  ['Ledger' as IWalletName]: getLedgerWallet,
  ['MathWallet' as IWalletName]: getMathWallet,
  ['Phantom' as IWalletName]: getPhantomWallet,
  ['Solflare' as IWalletName]: getSolflareWallet,
  ['SolflareWeb' as IWalletName]: getSolflareWebWallet,
  ['Sollet' as IWalletName]: getSolletWallet,
  ['SolletExtension' as IWalletName]: getSolletExtensionWallet,
  ['Torus' as IWalletName]: getTorusWallet
};

export const supportedWallets = Object.keys(walletsMap);

export function getWalletAdapter(
  walletName: IWalletName,
  config?: Record<string, unknown>
): Wallet {
  const createAdapter = walletsMap[walletName];
  return createAdapter(config);
}
