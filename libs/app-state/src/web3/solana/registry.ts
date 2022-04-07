import { PublicKey } from '@solana/web3.js';
import { getWallet as getWalletData, Wallet } from '@usm/sol-client';
import config, { MissingConfigError } from '@usm/config';
import { createRpcConnection, Cluster, Connection } from '@usm/sol-client';
import { AuctionAddress } from './models/auctions';

const { mplStorePubKey, mplAuctionPubKeys } = config;

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

export let wallet: Wallet | undefined;
export async function initWallet() {
  const walletData = getWalletData();
  const pendingWallet = walletData.wallet as NonNullable<Wallet>;
  await pendingWallet.ready();
  wallet = pendingWallet;
  return wallet;
}

export const walletPromise = new Promise<Wallet>((resolve) => {
  const id = setInterval(() => {
    if (wallet) {
      wallet.ready().then(() => {
        resolve(wallet as Wallet);
        clearInterval(id);
      });
    }
  }, 100);
});

export const getWallet = async () => walletPromise;

export let connection: Connection | undefined;
export function initConnection() {
  const cluster = config.solanaCluster as Cluster;
  if (!cluster) {
    throw new MissingConfigError('solanaCluster');
  }

  connection = createRpcConnection(cluster);
  return connection;
}

export const connectionPromise = new Promise<Connection>((resolve) => {
  const id = setInterval(() => {
    if (connection) {
      resolve(connection);
      clearInterval(id);
    }
  }, 100);
});

export const getConnection = async () => connectionPromise;
