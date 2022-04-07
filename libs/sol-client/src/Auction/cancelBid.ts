import { PublicKey } from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import { Connection, Wallet, actions } from '@metaplex/js';

import {
  AuctionExtended,
  AuctionProgram,
  BidderMetadata,
  BidderPot
} from '@metaplex-foundation/mpl-auction';
import { AuctionManager } from '@metaplex-foundation/mpl-metaplex';

import { withTransactionInterface, TransactionInterface } from '../utils';

const { getCancelBidTransactions, sendTransaction } = actions;
const getBidderPotTokenPDA = async (bidderPotPubKey: PublicKey) => {
  return AuctionProgram.findProgramAddress([
    Buffer.from(AuctionProgram.PREFIX),
    bidderPotPubKey.toBuffer(),
    Buffer.from('bidder_pot_token')
  ]);
};

/**
 * Parameters for {@link cancelBid}
 */
export interface CancelBidParams {
  connection: Connection;
  /** Wallet of the original bidder **/
  wallet: Wallet;
  /** Program account of the auction for the bid to be cancelled **/
  auction: PublicKey;
  /** The bidders token account they'll receive refund with **/
  destAccount?: PublicKey;
}

/**
 * Cancel a bid on a running auction. Any bidder can cancel any time during an auction, but only non-winners of the auction can cancel after it ends.
 * When users cancel, they receive full refunds.
 */
export const cancelBid = async ({
  connection,
  wallet,
  auction,
  destAccount
}: CancelBidParams): Promise<TransactionInterface> => {
  const bidder = wallet.publicKey;
  const auctionManager = await AuctionManager.getPDA(auction);
  const manager = await AuctionManager.load(connection, auctionManager);
  const {
    data: { tokenMint }
  } = await manager.getAuction(connection);

  const auctionTokenMint = new PublicKey(tokenMint);
  const vault = new PublicKey(manager.data.vault);
  const auctionExtended = await AuctionExtended.getPDA(vault);
  const bidderPot = await BidderPot.getPDA(auction, bidder);
  const bidderMeta = await BidderMetadata.getPDA(auction, bidder);
  const bidderPotToken = await getBidderPotTokenPDA(bidderPot);

  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);
  const txBatch = await getCancelBidTransactions({
    destAccount,
    bidder,
    accountRentExempt,
    bidderPot,
    bidderPotToken,
    bidderMeta,
    auction,
    auctionExtended,
    auctionTokenMint,
    vault
  });

  const txId = await sendTransaction({
    connection,
    wallet,
    txs: txBatch.toTransactions(),
    signers: txBatch.signers
  });

  return withTransactionInterface(connection, { txId });
};
