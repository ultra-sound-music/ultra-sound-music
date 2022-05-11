import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Wallet as WalletData, BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base';
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
import { Wallet as MplWallet } from '@metaplex/js';

export type { MplWallet };

export type Wallet = BaseMessageSignerWalletAdapter & {
  publicKey: NonNullable<PublicKey>;
};
export type INetworkId = number;
export type IPubKeyString = string;

export const walletsMap = {
  Ledger: getLedgerWallet,
  MathWallet: getMathWallet,
  Phantom: getPhantomWallet,
  Solflare: getSolflareWallet,
  SolflareWeb: getSolflareWebWallet,
  Sollet: getSolletWallet,
  SolletExtension: getSolletExtensionWallet,
  Torus: getTorusWallet
};

export type NetworkId = string;
export type WalletName = keyof typeof walletsMap;
export const defaultWalletName: WalletName = 'Phantom';

export const supportedWallets = Object.keys(walletsMap);

export const waitForWallet = (wallet: Wallet): Promise<string> => {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const key = wallet.publicKey as PublicKey;

      if (key) {
        clearInterval(intervalId);
        resolve(key && key !== PublicKey.default ? key.toString() : '');
      }
    }, 30);

    setTimeout(() => {
      resolve('');
      clearInterval(intervalId);
    }, 2000);
  });
};

export const getWalletData = (
  walletName: WalletName,
  config?: Record<string, unknown>
): WalletData => {
  const createAdapter = walletsMap[walletName];
  return createAdapter(config);
};

export function getWallet(walletName = defaultWalletName) {
  const config = {};
  const walletData = getWalletData(walletName, config);
  const { adapter, ...rest } = walletData;

  return {
    wallet: adapter,
    ...rest
  };
}

export async function getWalletBalance(connection: Connection, publicKey: PublicKey) {
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}
