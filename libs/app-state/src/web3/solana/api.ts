import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import * as solClient from '@usm/sol-client';
import { MissingConfigError } from '@usm/config';

import { getWallet, getConnection, getStorePublicKey } from './registry';
import { AuctionAddress } from './models/auctions';

export async function connectWallet() {
  const wallet = await getWallet();
  await wallet.connect();
  return wallet.publicKey?.toBase58();
}

export async function disconnectWallet() {
  const wallet = await getWallet();
  return wallet.disconnect();
}

export async function getWalletBalance() {
  const connection = await getConnection();
  const wallet = await getWallet();

  if (!wallet.publicKey) {
    return;
  }

  return solClient.getWalletBalance(connection, wallet.publicKey);
}

export async function getAuction(auction: Exclude<AuctionAddress, undefined>) {
  const wallet = await getWallet();
  const connection = await getConnection();
  const auctionPk = new PublicKey(auction);
  return solClient.getAuction(connection, wallet as solClient.MplWallet, auctionPk);
}

export async function placeBid(auction: Exclude<AuctionAddress, undefined>, amount: number) {
  const wallet = await getWallet();
  const connection = await getConnection();
  const auctionPk = new PublicKey(auction);

  return solClient.placeBid({
    connection,
    wallet: wallet as solClient.MplWallet,
    amount: new BN(amount * solClient.LAMPORTS_PER_SOL),
    auction: auctionPk
  });
}

export async function redeemBid(auction: AuctionAddress) {
  const wallet = await getWallet();
  const connection = await getConnection();
  const auctionPk = new PublicKey(auction);
  const store = getStorePublicKey();

  if (!store) {
    throw new MissingConfigError('mplStorePubKey');
  }

  return solClient.redeemBid({
    connection,
    wallet: wallet as solClient.MplWallet,
    store,
    auction: auctionPk
  });
}

export async function redeemParticipationBid(auction: AuctionAddress) {
  const wallet = await getWallet();
  const connection = await getConnection();
  const auctionPk = new PublicKey(auction);
  const store = getStorePublicKey();

  if (!wallet) {
    throw new Error('Wallet not set');
  }

  if (!store) {
    throw new MissingConfigError('mplStorePubKey');
  }

  return solClient.redeemParticipationBid({
    connection,
    wallet: wallet as solClient.MplWallet,
    store,
    auction: auctionPk
  });
}

export async function cancelBid(auction: AuctionAddress) {
  const wallet = await getWallet();
  const connection = await getConnection();
  const auctionPk = new PublicKey(auction);

  return solClient.cancelBid({
    connection,
    wallet: wallet as solClient.MplWallet,
    auction: auctionPk
  });
}
