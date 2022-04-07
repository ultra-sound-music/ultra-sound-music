import { PublicKey } from '@solana/web3.js';
import { AuctionProgram } from '@metaplex-foundation/mpl-auction';

export const getBidderPotTokenPDA = async (bidderPotPubKey: PublicKey) => {
  return AuctionProgram.findProgramAddress([
    Buffer.from(AuctionProgram.PREFIX),
    bidderPotPubKey.toBuffer(),
    Buffer.from('bidder_pot_token')
  ]);
};
