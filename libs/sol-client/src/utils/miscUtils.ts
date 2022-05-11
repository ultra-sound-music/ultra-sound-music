import { PublicKey } from '@solana/web3.js';
import { AuctionProgram } from '@metaplex-foundation/mpl-auction';

import config from '@usm/config';

export function getTransactionUrl(txId: string) {
  return `https://explorer.solana.com/tx/${txId}?cluster=${getSolanaCluster()}`;
}

export function getAccountUrl(address: string) {
  return `https://explorer.solana.com/address/${address}?cluster=${getSolanaCluster()}`;
}

export function getSolanaCluster() {
  return config.solanaRpc.includes('devnet') ? 'devnet' : 'mainnet';
}

export const getBidderPotTokenPDA = async (bidderPotPubKey: PublicKey) => {
  return AuctionProgram.findProgramAddress([
    Buffer.from(AuctionProgram.PREFIX),
    bidderPotPubKey.toBuffer(),
    Buffer.from('bidder_pot_token')
  ]);
};

// Taken from governance-ui
export function chunks<T>(array: T[], size: number): T[][] {
  const result: Array<T[]> = [];
  let i, j;
  for (i = 0, j = array.length; i < j; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
