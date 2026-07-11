import { PublicKey } from '@solana/web3.js';

export type UsmBidData = {
  bidder: string;
  bid: number;
  timestamp: number;
  hasBeenRedeemed?: boolean;
  hasRedeemedParticipationToken?: boolean;
  hasBeenRefunded?: boolean;
  won?: boolean;
};

export interface UsmNftAttributes {
  trait_type: string;
  value: string;
  display_type: string;
}

export type NftUriMetaData = {
  name: string;
  image: string;
  description?: string;
  attributes?: UsmNftAttributes[];
};

export type NftData = {
  pubKey: PublicKey;
  metadata: NftUriMetaData;
};

export type USMAuctionData = {
  pubkey: PublicKey;
  auctionNft: NftData;
  participationNft?: NftData;
  acceptedToken: PublicKey;
  endTimestamp?: EpochTimeStamp;
  tickSize: number;
  floor: number;
  state: AuctionState;
  bids: UsmBidData[];
  isCancelled?: boolean;
};

const auctionStates = ['created', 'started', 'ended'] as const;
export type AuctionState = (typeof auctionStates)[number];
