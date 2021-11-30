import {
  Wallet,
  WalletName,
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolflareWebWallet,
  getSolletWallet,
  getSolletExtensionWallet,
  getTorusWallet
} from '@solana/wallet-adapter-wallets';

export type IWalletName = keyof typeof WalletName;

export const detaultWalletName = WalletName.Phantom;

export const walletsMap = {
  [WalletName.Ledger]: getLedgerWallet,
  [WalletName.MathWallet]: getMathWallet,
  [WalletName.Phantom]: getPhantomWallet,
  [WalletName.Solflare]: getSolflareWallet,
  [WalletName.SolflareWeb]: getSolflareWebWallet,
  [WalletName.Sollet]: getSolletWallet,
  [WalletName.SolletExtension]: getSolletExtensionWallet,
  [WalletName.Torus]: getTorusWallet
};

export const supportedWallets = Object.keys(walletsMap);

export function getWalletAdapter(
  walletName: IWalletName,
  config?: Record<string, unknown>
): Wallet {
  const createAdapter = walletsMap[walletName];
  return createAdapter(config);
}
