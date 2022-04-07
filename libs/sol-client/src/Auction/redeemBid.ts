import { Keypair, PublicKey, Connection } from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import { Wallet, transactions, actions } from '@metaplex/js';
import { AuctionExtended, BidderMetadata } from '@metaplex-foundation/mpl-auction';

import {
  AuctionManager,
  MetaplexProgram,
  RedeemBid,
  SafetyDepositConfig
} from '@metaplex-foundation/mpl-metaplex';

import { Vault } from '@metaplex-foundation/mpl-token-vault';
import {
  Metadata,
  UpdatePrimarySaleHappenedViaToken
} from '@metaplex-foundation/mpl-token-metadata';

import { TransactionsBatch, withTransactionInterface, TransactionInterface } from '../utils';

const { CreateTokenAccount } = transactions;
const { sendTransaction } = actions;

export interface RedeemBidParams {
  connection: Connection;
  wallet: Wallet;
  auction: PublicKey;
  store: PublicKey;
}

export interface RedeemBidResponse {
  txId: string;
}

export const redeemBid = async ({
  connection,
  wallet,
  store,
  auction
}: RedeemBidParams): Promise<TransactionInterface> => {
  const bidder = wallet.publicKey;
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);
  const auctionManager = await AuctionManager.getPDA(auction);
  const manager = await AuctionManager.load(connection, auctionManager);
  const vault = await Vault.load(connection, manager.data.vault);
  const fractionMint = new PublicKey(vault.data.fractionMint);
  const auctionExtended = await AuctionExtended.getPDA(vault.pubkey);

  // Get the safety deposit box.
  // The primary NFT will not always be the first in the array of boxes. Maybe "order" will be reliable?
  const boxes = await vault.getSafetyDepositBoxes(connection);
  const primaryBox = boxes.find((box) => box.data.order === 0);

  if (!primaryBox) {
    throw new Error('Vault is missing the primary NFT');
  }

  const tokenMint = new PublicKey(primaryBox.data.tokenMint);
  const safetyDepositTokenStore = new PublicKey(primaryBox.data.store);
  const bidderMeta = await BidderMetadata.getPDA(auction, bidder);
  const bidRedemption = await getBidRedemptionPDA(auction, bidderMeta);
  const safetyDepositConfig = await SafetyDepositConfig.getPDA(auctionManager, primaryBox.pubkey);
  const transferAuthority = await Vault.getPDA(vault.pubkey);
  const metadata = await Metadata.getPDA(tokenMint);

  const txBatch = await getRedeemTokenTransferOnlyTransactions({
    accountRentExempt,
    tokenMint,
    bidder,
    bidderMeta,
    store,
    vault: vault.pubkey,
    auction,
    auctionExtended,
    auctionManager,
    fractionMint,
    safetyDepositTokenStore,
    safetyDeposit: primaryBox.pubkey,
    bidRedemption,
    safetyDepositConfig,
    transferAuthority,
    metadata
  });

  const txId = await sendTransaction({
    connection,
    wallet,
    txs: txBatch.toTransactions(),
    signers: txBatch.signers
  });

  return withTransactionInterface(connection, { txId });
};

interface RedeemTransactionsParams {
  bidder: PublicKey;
  accountRentExempt: number;
  bidderPotToken?: PublicKey;
  bidderMeta: PublicKey;
  auction: PublicKey;
  auctionExtended: PublicKey;
  tokenMint: PublicKey;
  vault: PublicKey;
  store: PublicKey;
  auctionManager: PublicKey;
  bidRedemption: PublicKey;
  safetyDepositTokenStore: PublicKey;
  safetyDeposit: PublicKey;
  fractionMint: PublicKey;
  safetyDepositConfig: PublicKey;
  transferAuthority: PublicKey;
  metadata: PublicKey;
}

export const getRedeemTokenTransferOnlyTransactions = async ({
  accountRentExempt,
  bidder,
  tokenMint,
  store,
  vault,
  auction,
  auctionManager,
  auctionExtended,
  bidRedemption,
  bidderMeta,
  safetyDepositTokenStore,
  safetyDeposit,
  fractionMint,
  safetyDepositConfig,
  transferAuthority,
  metadata
}: RedeemTransactionsParams) => {
  const txBatch = new TransactionsBatch({ transactions: [] });

  // create a new account for redeeming
  const account = Keypair.generate();
  const createDestinationTransaction = new CreateTokenAccount(
    { feePayer: bidder },
    {
      newAccountPubkey: account.publicKey,
      lamports: accountRentExempt,
      mint: tokenMint
    }
  );
  txBatch.addTransaction(createDestinationTransaction);
  const redeemBidTransaction = new RedeemBid(
    { feePayer: bidder },
    {
      store,
      vault,
      auction,
      auctionManager,
      bidRedemption,
      bidderMeta,
      safetyDepositTokenStore,
      destination: account.publicKey,
      safetyDeposit,
      fractionMint,
      bidder,
      isPrintingType: false,
      safetyDepositConfig,
      auctionExtended,
      transferAuthority
    }
  );
  txBatch.addTransaction(redeemBidTransaction);

  const updatePrimarySaleHappenedViaTokenTransaction = new UpdatePrimarySaleHappenedViaToken(
    { feePayer: bidder },
    {
      metadata,
      owner: bidder,
      tokenAccount: account.publicKey
    }
  );
  txBatch.addTransaction(updatePrimarySaleHappenedViaTokenTransaction);

  txBatch.addSigner(account);
  return txBatch;
};

export const getBidRedemptionPDA = async (auction: PublicKey, bidderMeta: PublicKey) => {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from(MetaplexProgram.PREFIX), auction.toBuffer(), bidderMeta.toBuffer()],
      MetaplexProgram.PUBKEY
    )
  )[0];
};
