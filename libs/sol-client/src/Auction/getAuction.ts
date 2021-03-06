import fetch from 'cross-fetch';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Connection, Wallet } from '@metaplex/js';

import {
  Auction,
  AuctionState as AuctionStateEnum,
  AuctionExtended,
  BidderMetadataData
} from '@metaplex-foundation/mpl-auction';

import { Vault } from '@metaplex-foundation/mpl-token-vault';

import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { AuctionManager, BidRedemptionTicket } from '@metaplex-foundation/mpl-metaplex';
import { Account } from '@metaplex-foundation/mpl-core';
import { getBidRedemptionTicket, hasRedeemedBid } from '../utils/bidRedemption';

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
};

const auctionStates = ['created', 'started', 'ended'] as const;
export type AuctionState = typeof auctionStates[number];

export const getAuction = async (connection: Connection, wallet: Wallet, auctionPk: PublicKey) => {
  const auction = await Auction.load(connection, auctionPk);

  // @TODO - Get Transaction ID for each bid
  // @TODO - Get NFT + Metadata
  // Examples for getting all this other information can be found in:
  // metaplex/js/packages/web/src/views/auction/index.tsx
  // metaplex/js/packages/web/src/hooks/useAuctions.ts -> AuctionView (an amalgamation of various data sources)
  return transformAuctionData(auction, connection, wallet?.publicKey);
};

export const transformAuctionData = async (
  auction: Auction,
  connection: Connection,
  bidder?: PublicKey
): Promise<USMAuctionData | undefined> => {
  const auctionManagerPk = await AuctionManager.getPDA(auction.pubkey);
  const auctionManager = await AuctionManager.load(connection, auctionManagerPk);
  const vaultPk = new PublicKey(auctionManager.data.vault);
  const vault = await Vault.load(connection, vaultPk);
  const boxes = await vault.getSafetyDepositBoxes(connection);
  const auctionExtendedPk = await AuctionExtended.getPDA(vaultPk);
  const auctionExtended = await AuctionExtended.load(connection, auctionExtendedPk);

  // The NFTs inside the safetyDepositBox array are not in any particular order.
  // Instead we have to rely on each box's "order" property.
  // The participation NFT, *I think*, is the one with the highest order (e.g. you can have > 1 non-participation NFTs)
  const primaryNftOrder = 0;
  const participationNftOrder = Math.min(1, boxes.length - 1);
  const primaryBox = boxes.find((box) => box.data.order === primaryNftOrder);
  const participationBox = boxes.find((box) => box.data.order === participationNftOrder);

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

  let bidderRedemptionTicket: BidRedemptionTicket | undefined;
  if (bidder) {
    try {
      // @TODO - confirm if bid redemption tickets only exist IF the auction has ended.
      // If so, then only make this check call if the auction is ended
      // If not,then there's something strange going on with:
      // user -> At3TUERJEqU5CE8ipb7v7LuLtTQ5ZoGK8ELij9bSFNPU
      // auction -> 7qSVDA7vXZ5DDus65SEJP8YuMzq5zpiU4g9iWxhfHmpZ
      bidderRedemptionTicket = await getBidRedemptionTicket(
        connection,
        new PublicKey(auction.pubkey),
        bidder
      );
    } catch (error) {
      console.error(error);
    }
  }

  const usmBidData = bids
    .filter((bid) => !isCancelledBid(bid.data, auctionState))
    .sort((a, b) => b.data.lastBid.toNumber() - a.data.lastBid.toNumber())
    .map(({ data }, index) => {
      const bidData: UsmBidData = {
        bidder: data.bidderPubkey,
        bid: data.lastBid.toNumber() / LAMPORTS_PER_SOL,
        timestamp: data.lastBidTimestamp.toNumber() * 1000
      };

      if (auctionState === AuctionStateEnum.Ended) {
        const hasBeenRedeemed =
          bidder?.toBase58() === data.bidderPubkey && bidderRedemptionTicket
            ? hasRedeemedBid(bidderRedemptionTicket, primaryNftOrder)
            : undefined;
        const hasRedeemedParticipationToken =
          bidder?.toBase58() === data.bidderPubkey && bidderRedemptionTicket
            ? hasRedeemedBid(bidderRedemptionTicket, participationNftOrder)
            : undefined;
        return {
          hasBeenRedeemed,
          hasRedeemedParticipationToken,
          hasBeenRefunded: !!data.cancelled,
          won: index < maxWinners,
          ...bidData
        };
      }

      return bidData;
    });

  const endTimestamp = auction.data.endedAt ? auction.data.endedAt.toNumber() * 1000 : undefined;
  const tickSize = (auctionExtended?.data?.tickSize?.toNumber() || 0) / LAMPORTS_PER_SOL || 0.05;

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
    tickSize,
    floor: tickSize, // @TODO - use actual floorPrice from Auction model
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
