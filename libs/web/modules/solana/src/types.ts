import { PublicKey } from '@solana/web3.js';

export type AccountAddress = string;

export type USMAuctionData = {
  pubkey: PublicKey;
  auctionNft: any; // NftData
  participationNft?: any;
  acceptedToken: PublicKey;
  endTimestamp?: EpochTimeStamp;
  tickSize: number;
  floor: number;
  state: any; // AuctionState
  bids: any[]; // UsmBidData
};
