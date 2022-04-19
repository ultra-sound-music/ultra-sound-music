import { BidderMetadata } from '@metaplex-foundation/mpl-auction';
import { Connection, PublicKey } from '@solana/web3.js';
import { BidRedemptionTicket } from '@metaplex-foundation/mpl-metaplex';
import { getBidRedemptionPDA } from './redeemBid';

export const getBidRedemptionTicket = async (
  connection: Connection,
  auction: PublicKey,
  bidder: PublicKey
) => {
  const bidderMetaPDA = await BidderMetadata.getPDA(auction, bidder);
  const bidRedemptionPDA = await getBidRedemptionPDA(auction, bidderMetaPDA);
  const accountInfo = await connection.getAccountInfo(bidRedemptionPDA);
  return new BidRedemptionTicket(bidRedemptionPDA, accountInfo);
};

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
