import fetch from 'cross-fetch';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Connection, Wallet } from '@metaplex/js';

import {
  Auction,
  AuctionState as AuctionStateEnum,
  BidderMetadataData
} from '@metaplex-foundation/mpl-auction';

import { Vault } from '@metaplex-foundation/mpl-token-vault';

import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { AuctionManager } from '@metaplex-foundation/mpl-metaplex';
import { Account } from '@metaplex-foundation/mpl-core';

export type USMBidData = {
  bidder: string;
  bid: number;
  timestamp: number;
  hasBeenRedeemed?: boolean;
  hasRedeemedParticipationToken?: boolean;
  hasBeenRefunded?: boolean;
  won?: boolean;
};

export type NftData = {
  pubKey: PublicKey;
  metadata: any;
};

export type USMAuctionData = {
  pubkey: PublicKey;
  auctionNft: NftData;
  participationNft?: NftData;
  acceptedToken: PublicKey;
  endTimestamp?: EpochTimeStamp;
  state: AuctionState;
  bids: USMBidData[];
};

const auctionStates = ['created', 'started', 'ended'] as const;
export type AuctionState = typeof auctionStates[number];

export const getAuction = async (connection: Connection, wallet: Wallet, pubKey: PublicKey) => {
  const auction = await Auction.load(connection, pubKey);

  // @TODO - Get Transaction ID for each bid
  // @TODO - Get NFT + Metadata
  // Examples for getting all this other information can be found in:
  // metaplex/js/packages/web/src/views/auction/index.tsx
  // metaplex/js/packages/web/src/hooks/useAuctions.ts -> AuctionView (an amalgamation of various data sources)
  return transformAuctionData(auction, connection, wallet.publicKey);
};

export const transformAuctionData = async (
  auction: Auction,
  connection: Connection,
  bidder: PublicKey
): Promise<USMAuctionData | undefined> => {
  const auctionManagerPk = await AuctionManager.getPDA(auction.pubkey);
  const auctionManager = await AuctionManager.load(connection, auctionManagerPk);
  const vault = await Vault.load(connection, new PublicKey(auctionManager.data.vault));
  const boxes = await vault.getSafetyDepositBoxes(connection);

  // The primary NFT will not always be the first in the array of boxes. Maybe "order" will be reliable?
  // The participation NFT, *I think*, is the one with the highest order (you can have > 1 non-participation NFTs)
  const primaryBox = boxes.find((box) => box.data.order === 0);
  const participationBox = boxes.find((box) => box.data.order === boxes.length);

  if (!primaryBox) {
    return;
  }

  const nftPubKey = primaryBox.data.tokenMint;
  const nftData = await getMetadata(new PublicKey(nftPubKey), connection);
  const nftMetadata = await fetch(nftData.uri).then((response) => response.json());

  const participationNftPubKey = participationBox?.data.tokenMint;
  const participationData = participationNftPubKey
    ? await getMetadata(new PublicKey(participationNftPubKey), connection)
    : undefined;
  const participationMetadata = participationData
    ? await fetch(participationData.uri).then((response) => response.json())
    : undefined;

  const auctionState = auction.data.state;
  const maxWinners = auction.data.bidState.max.toNumber();
  const bids = await auction.getBidderMetadata(connection);
  const usmBidData = bids
    .filter((bid) => !isCancelledBid(bid.data, auctionState))
    .sort((a, b) => b.data.lastBid.toNumber() - a.data.lastBid.toNumber())
    .map(({ data }, index) => {
      const bidData: USMBidData = {
        bidder: data.bidderPubkey,
        bid: data.lastBid.toNumber() / LAMPORTS_PER_SOL,
        timestamp: data.lastBidTimestamp.toNumber() * 1000
      };

      if (auctionState === AuctionStateEnum.Ended) {
        return {
          hasBeenRedeemed: false, // @TODO
          hasRedeemedParticipationToken: false, // @TODO
          hasBeenRefunded: !!data.cancelled,
          won: index < maxWinners,
          ...bidData
        };
      }

      return bidData;
    });

  let endTimestamp;
  if (auctionState === AuctionStateEnum.Ended) {
    endTimestamp = auction.data.endedAt ? auction.data.endedAt.toNumber() * 1000 : undefined;
  } else {
    endTimestamp = auction.data.endAuctionAt
      ? auction.data.endAuctionAt.toNumber() * 1000
      : undefined;
  }

  return {
    pubkey: auction.pubkey,
    auctionNft: {
      pubKey: new PublicKey(nftPubKey),
      metadata: nftMetadata
    },
    participationNft: participationNftPubKey
      ? {
          pubKey: new PublicKey(participationNftPubKey),
          metadata: participationMetadata
        }
      : undefined,
    acceptedToken: new PublicKey(auction.data.tokenMint),
    endTimestamp,
    state: auctionStates[auctionState],
    bids: usmBidData
  };
};

export function isCancelledBid(bidderMetaData: BidderMetadataData, auctionState: AuctionStateEnum) {
  return !!bidderMetaData.cancelled && auctionState !== AuctionStateEnum.Ended;
}

export const getMetadata = async (tokenMint: PublicKey, connection: Connection) => {
  const metadata = await Metadata.getPDA(tokenMint);
  const metadataInfo = await Account.getInfo(connection, metadata);
  const { data } = new Metadata(metadata, metadataInfo).data;
  return data;
};
