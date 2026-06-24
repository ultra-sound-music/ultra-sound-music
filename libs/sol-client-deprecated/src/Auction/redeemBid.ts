import { PublicKey, Connection } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
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

import { TransactionInterface, withTransactionInterface, TransactionsBatch } from '../utils';

const { CreateAssociatedTokenAccount } = transactions;
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
    wallet,
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
  wallet: Wallet;
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

  // get deterministic token address of bidder to deposit token

  const destAcct = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    tokenMint,
    bidder
  );

  // create associated token account so that we can retreive this later

  const createDestinationTransaction = new CreateAssociatedTokenAccount(
    { feePayer: bidder },
    {
      associatedTokenAddress: destAcct,
      walletAddress: bidder,
      splTokenMintAddress: tokenMint
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
      destination: destAcct,
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
      tokenAccount: destAcct
    }
  );
  txBatch.addTransaction(updatePrimarySaleHappenedViaTokenTransaction);
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
