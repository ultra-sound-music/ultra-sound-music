import BN from 'bn.js';
import { Commitment, PublicKey, TransactionSignature } from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import { Connection, Wallet, actions } from '@metaplex/js';

import {
  AuctionExtended,
  BidderMetadata,
  BidderPot,
  PlaceBid
} from '@metaplex-foundation/mpl-auction';

import { AuctionManager } from '@metaplex-foundation/mpl-metaplex';

import {
  getBidderPotTokenPDA,
  TransactionsBatch,
  withTransactionInterface,
  TransactionInterface
} from '../utils';

/**
 * Parameters for {@link placeBid}s
 */
export interface PlaceBidParams {
  connection: Connection;
  /** The wallet from which tokens will be taken and transferred to the {@link bidderPotToken} account **/
  wallet: Wallet;
  /** The {@link Auction} program account address for the bid **/
  auction: PublicKey;
  /** Associated token account for the bidder pot **/
  bidderPotToken?: PublicKey;
  /** Amount of tokens (accounting for decimals) or lamports to bid. One important nuance to remember is that each token mint has a different amount of decimals, which need to be accounted while specifying the amount. For instance, to send 1 token with a 0 decimal mint you would provide `1` as the amount, but for a token mint with 6 decimals you would provide `1000000` as the amount to transfer one whole token **/
  amount: BN;
  commitment?: Commitment;
}

const { getCancelBidTransactions, createApproveTxs, createWrappedAccountTxs, sendTransaction } =
  actions;

/**
 * Place a bid by moving funds from the provided wallet to the bidder pot account.
 */
export const placeBid = async ({
  connection,
  wallet,
  amount,
  auction
}: PlaceBidParams): Promise<TransactionInterface> => {
  const bidder = wallet.publicKey;
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);
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

  const accountInfo = await connection.getAccountInfo(bidderPotToken);

  let txBatch = new TransactionsBatch({ transactions: [] });

  // An existing bidder pot account means the user has an existing bid.
  // Cancel it before placing a new bid.
  if (accountInfo) {
    txBatch = await getCancelBidTransactions({
      destAccount: undefined,
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
  }

  // create paying account
  const {
    account: payingAccount,
    createTokenAccountTx,
    closeTokenAccountTx
  } = await createWrappedAccountTxs(connection, bidder, amount.toNumber() + accountRentExempt * 2);
  txBatch.addTransaction(createTokenAccountTx);
  txBatch.addSigner(payingAccount);
  ////

  // transfer authority
  const {
    authority: transferAuthority,
    createApproveTx,
    createRevokeTx
  } = createApproveTxs({
    account: payingAccount.publicKey,
    owner: bidder,
    amount: amount.toNumber()
  });
  txBatch.addTransaction(createApproveTx);
  txBatch.addAfterTransaction(createRevokeTx);
  txBatch.addAfterTransaction(closeTokenAccountTx);
  txBatch.addSigner(transferAuthority);
  ////

  // create place bid transaction
  const placeBidTransaction = new PlaceBid(
    { feePayer: bidder },
    {
      bidder,
      bidderToken: payingAccount.publicKey,
      bidderPot,
      bidderPotToken,
      bidderMeta,
      auction,
      auctionExtended,
      tokenMint: auctionTokenMint,
      transferAuthority: transferAuthority.publicKey,
      amount,
      resource: vault
    }
  );
  txBatch.addTransaction(placeBidTransaction);
  ////

  const txId = await sendTransaction({
    connection,
    wallet,
    txs: txBatch.toTransactions(),
    signers: txBatch.signers
  });

  return withTransactionInterface(connection, { txId });
};
