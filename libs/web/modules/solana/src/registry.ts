import { PublicKey } from '@solana/web3.js';
import memoize from 'lodash/memoize';

import {} from 'libs/shared/sol-client/src';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import logger from '@usm/logger';

import { AccountAddress } from './types';

export type AuctionPublicKeysMap = Record<string, PublicKey>;

const WALLET_INIT_TIMEOUT = 10000;
let wallet: Wallet;
let walletPromise: Promise<Wallet>;

export let getStorePublicKey: () => Promise<PublicKey>;
export let getAuctionPublicKeys: () => PublicKey[];
export let getAuctionAddresses: () => AccountAddress[];

// Initialize the wallet and immediately set up the walletPromise
// such that calls to getWallet() can legitimately throw if the wallet
// has not been initialized OR wait on the wallet to finish initializing
export async function initWallet() {
  const startTime = Date.now();
  walletPromise = new Promise((resolve, reject) => {
    const id = setInterval(() => {
      const isReady = wallet?.readyState === WalletReadyState.Installed;
      if (isReady) {
        clearInterval(id);
        resolve(wallet as Wallet);
      }

      if (Date.now() - startTime > WALLET_INIT_TIMEOUT) {
        clearInterval(id);
        reject('Wallet failed to initialize');
      }
    }, 100);
  });

  wallet = getSolWallet();
  return wallet;
}

export async function getWallet() {
  if (!walletPromise) {
    throw new Error('Wallet not initialized');
  }

  return walletPromise;
}

export let connection: Connection;
export function initConnection(cluster: Cluster) {
  connection = createRpcConnection(cluster);
  return connection;
}

export function getConnection() {
  if (!connection) {
    throw new Error('Connection not initialized');
  }

  return connection;
}

export async function initAuctions(auctionOwner: AccountAddress, auctionAddresses: AccountAddress[]) {
  const connection = getConnection();

  if (auctionAddresses.length) {
    logger.info('Auctions are enabled');
  } else {
    logger.info('Auctions are disabled');
    return;
  }

  if (!auctionOwner) {
    throw new Error('You must configure an auction owner.');
  }

  const auctionOwnerPk = new PublicKey(auctionOwner);
  const storePkPromise = Store.getPDA(auctionOwnerPk);

  // Set the getters up synchronously so they become immediately available
  getStorePublicKey = () => storePkPromise;
  getAuctionPublicKeys = memoize(() => auctionAddresses.map((a) => new PublicKey(a)));
  getAuctionAddresses = () => auctionAddresses;

  const storePk = await storePkPromise;
  const store = await Store.load(connection, storePk);
  const auctionManagers = await store.getAuctionManagers(connection);
  const mismatchedAuctions = auctionAddresses.filter(
    (auctionAddress) => !auctionManagers.some((auctionMgr) => auctionMgr.data.auction === auctionAddress)
  );

  if (mismatchedAuctions.length) {
    throw Error(
      `Auction owner mismatch. Wallet ${auctionOwner} does not own the following addresses: ${mismatchedAuctions}`
    );
  }

  return auctionAddresses;
}
