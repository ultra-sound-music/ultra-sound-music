import { PublicKey } from '@solana/web3.js';
import { getWallet as getWalletData, Wallet } from '@usm/sol-client';
import config, { MissingConfigError } from '@usm/config';
import { createRpcConnection, Cluster, Connection } from '@usm/sol-client';
import { AuctionAddress } from './models/auctions';

const { mplStorePubKey, mplAuctionPubKeys } = config;
const WALLET_INIT_TIMEOUT = 10000;

export type AuctionPublicKeysMap = Record<string, PublicKey>;

let storePk: PublicKey;
export function getStorePublicKey() {
  if (!mplStorePubKey) {
    return;
  }

  if (!storePk) {
    storePk = new PublicKey(mplStorePubKey);
  }

  return storePk;
}

let auctionPks: AuctionPublicKeysMap;
export function getAuctionPublicKeysMap() {
  if (!mplAuctionPubKeys || !Array.isArray(mplAuctionPubKeys)) {
    return;
  }

  if (!auctionPks) {
    auctionPks = mplAuctionPubKeys.reduce<AuctionPublicKeysMap>((obj, val) => {
      obj[val] = new PublicKey(val);
      return obj;
    }, {});
  }

  return auctionPks;
}

const emptyAuctionPks: PublicKey[] = [];
export function getAuctionPublicKeys() {
  const pkMap = getAuctionPublicKeysMap();
  return pkMap ? Object.values(pkMap) : emptyAuctionPks;
}

const emptyAuctionAddresses: AuctionAddress[] = [];
export function getAuctionAddresses() {
  const pkMap = getAuctionPublicKeysMap();
  return pkMap ? Object.keys(pkMap) : emptyAuctionAddresses;
}

let wallet: Wallet;
let walletPromise: Promise<typeof wallet>;

// Initialize the wallet and immediately set up the walletPromise
// such that calls to getWallet() can legitimately throw if the wallet
// has not been initialized OR wait on the wallet to finish initializing
export async function initWallet() {
  const startTime = Date.now();
  walletPromise = new Promise((resolve, reject) => {
    const id = setInterval(() => {
      if (wallet) {
        clearInterval(id);
        wallet.ready().then(() => {
          resolve(wallet as Wallet);
        });
      }

      if (Date.now() - startTime > WALLET_INIT_TIMEOUT) {
        clearInterval(id);
        reject('Wallet failed to initialize');
      }
    }, 100);
  });

  const walletData = getWalletData();
  wallet = walletData.wallet as NonNullable<Wallet>;
  await wallet.ready();
  return wallet;
}

export async function getWallet() {
  if (!walletPromise) {
    throw new Error('Wallet not initialized');
  }

  return walletPromise;
}

export let connection: Connection;
export function initConnection() {
  const cluster = config.solanaCluster as Cluster;
  if (!cluster) {
    throw new MissingConfigError('solanaCluster');
  }

  connection = createRpcConnection(cluster);
  return connection;
}

export function getConnection() {
  if (!connection) {
    throw new Error('Connection not initialized');
  }

  return connection;
}
