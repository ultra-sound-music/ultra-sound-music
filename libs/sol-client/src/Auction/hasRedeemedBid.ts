import { BidderMetadata } from '@metaplex-foundation/mpl-auction';
import { getBidRedemptionPDA } from './redeemBid';
import { Connection, PublicKey } from '@solana/web3.js';
import { BidRedemptionTicket } from '@metaplex-foundation/mpl-metaplex';

export const hasRedeemedTicket = async (
  connection: Connection,
  auction: PublicKey,
  bidder: PublicKey,
  order: number
) => {
  const bidderMetaPDA = await BidderMetadata.getPDA(auction, bidder);
  const bidRedemptionPDA = await getBidRedemptionPDA(auction, bidderMetaPDA);
  const accountInfo = await connection.getAccountInfo(bidRedemptionPDA);
  const bidRedemption = new BidRedemptionTicket(bidRedemptionPDA, accountInfo);

  const data = bidRedemption.data.data;

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
