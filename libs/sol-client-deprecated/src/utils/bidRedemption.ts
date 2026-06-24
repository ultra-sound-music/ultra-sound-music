import bs58 from 'bs58';

import { BidderMetadata } from '@metaplex-foundation/mpl-auction';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  AuctionManager,
  MetaplexProgram,
  BidRedemptionTicket,
  MetaplexKey,
  WINNER_INDEX_OFFSETS,
  ParticipationConfigV2,
  WinningConstraint,
  NonWinningConstraint
} from '@metaplex-foundation/mpl-metaplex';
import { getBidRedemptionPDA } from '../Auction/redeemBid';

export const getBidRedemptionTicket = async (
  connection: Connection,
  auction: PublicKey,
  bidder: PublicKey
) => {
  const bidderMetaPDA = await BidderMetadata.getPDA(auction, bidder);
  const bidRedemptionPDA = await getBidRedemptionPDA(auction, bidderMetaPDA);
  const accountInfo = await connection.getAccountInfo(bidRedemptionPDA);
  if (!accountInfo) {
    throw new Error(`No bid redemption ticket for bidder, ${bidder}`);
  }

  return new BidRedemptionTicket(bidRedemptionPDA, accountInfo);
};

export async function getBidRedemptionTickets(
  connection: Connection,
  auctionManager: AuctionManager,
  haveWinnerIndex = true
) {
  return (
    await MetaplexProgram.getProgramAccounts(connection, {
      filters: [
        // Filter for BidRedemptionTicketV2 by key
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(Buffer.from([MetaplexKey.BidRedemptionTicketV2]))
          }
        },
        // Filter for assigned to this auction manager
        {
          memcmp: {
            offset: WINNER_INDEX_OFFSETS[+haveWinnerIndex],
            bytes: auctionManager.pubkey.toBase58()
          }
        }
      ]
    })
  ).map((account) => BidRedemptionTicket.from(account));
}

export const hasRedeemedBid = (ticket: BidRedemptionTicket, order: number) => {
  const data = ticket.data.data;

  let offset = 42;
  if (data[1] == 0) {
    offset -= 8;
  }
  const index = Math.floor(order / 8) + offset;
  const positionFromRight = 7 - (order % 8);
  const mask = Math.pow(2, positionFromRight);

  const appliedMask = data[index] & mask;

  return appliedMask != 0;
};

export function isEligibleForParticipationPrize(
  winIndex: number | null,
  { nonWinningConstraint, winnerConstraint }: ParticipationConfigV2 = {} as ParticipationConfigV2
) {
  const noWinnerConstraints = winnerConstraint !== WinningConstraint.NoParticipationPrize;
  const noNonWinnerConstraints = nonWinningConstraint !== NonWinningConstraint.NoParticipationPrize;
  return (
    (winIndex === null && noNonWinnerConstraints) || (winIndex !== null && noWinnerConstraints)
  );
}
