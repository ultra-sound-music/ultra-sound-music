import {
  Keypair,
  PublicKey,
  Connection,
  sendAndConfirmTransaction,
  Transaction
} from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import { Wallet, transactions } from '@metaplex/js';
import {
  AuctionExtended,
  BidderMetadata
} from '@metaplex-foundation/mpl-auction';
import { TransactionsBatch } from '../utils/utils';
import {
  AuctionManager,
  MetaplexProgram,
  RedeemBid,
  SafetyDepositConfig
} from '@metaplex-foundation/mpl-metaplex';
const { CreateTokenAccount } = transactions;
import { Vault } from '@metaplex-foundation/mpl-token-vault';
import {
  Metadata,
  UpdatePrimarySaleHappenedViaToken
} from '@metaplex-foundation/mpl-token-metadata';

export interface RedeemTokenOnlyBidParams {
  connection: Connection;
  wallet: Wallet;
  auction: PublicKey;
  store: PublicKey;
}

export interface RedeemTokenOnlyBidResponse {
  txId: string;
}

export const redeemTokenOnlyBid = async ({
  connection,
  wallet,
  store,
  auction
}: RedeemTokenOnlyBidParams): Promise<RedeemTokenOnlyBidResponse> => {
  // get data for transactions

  const bidder = wallet.publicKey;

  //rent exemption for new acct

  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );

  // load auction manager

  const auctionManager = await AuctionManager.getPDA(auction);
  const manager = await AuctionManager.load(connection, auctionManager);
  const vault = await Vault.load(connection, manager.data.vault);
  const fractionMint = new PublicKey(vault.data.fractionMint);
  const auctionExtended = await AuctionExtended.getPDA(vault.pubkey);

  // get first safety deposit box as this is our auction nft safety deposit box

  const [safetyDepositBox] = await vault.getSafetyDepositBoxes(connection);

  //token mint of safety deposit box
  const tokenMint = new PublicKey(safetyDepositBox.data.tokenMint);

  //safety deposit token store
  const safetyDepositTokenStore = new PublicKey(safetyDepositBox.data.store);

  const bidderMeta = await BidderMetadata.getPDA(auction, bidder);

  const bidRedemption = await getBidRedemptionPDA(auction, bidderMeta);

  //safet deposit confit
  const safetyDepositConfig = await SafetyDepositConfig.getPDA(
    auctionManager,
    safetyDepositBox.pubkey
  );

  //vault is transfer authority over asset

  const transferAuthority = await Vault.getPDA(vault.pubkey);

  //metadata of NFT
  const metadata = await Metadata.getPDA(tokenMint);
  ////

  const { txBatch, account } = await getRedeemTokenTransferOnlyTransactions({
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
    safetyDeposit: safetyDepositBox.pubkey,
    bidRedemption,
    safetyDepositConfig,
    transferAuthority,
    metadata
  });

  const tx = new Transaction();
  tx.add(...txBatch.toTransactions());

  const txId = await sendAndConfirmTransaction(connection, tx, [account], {
    commitment: 'finalized'
  });

  return { txId };
};

interface RedeemTokenOnlyTransactionsParams {
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
}: RedeemTokenOnlyTransactionsParams) => {
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

  // create redeem bid
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
  ////

  // update primary sale happened via token
  const updatePrimarySaleHappenedViaTokenTransaction =
    new UpdatePrimarySaleHappenedViaToken(
      { feePayer: bidder },
      {
        metadata,
        owner: bidder,
        tokenAccount: account.publicKey
      }
    );
  txBatch.addTransaction(updatePrimarySaleHappenedViaTokenTransaction);
  ////

  return { txBatch, account };
};

export const getBidRedemptionPDA = async (
  auction: PublicKey,
  bidderMeta: PublicKey
) => {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from(MetaplexProgram.PREFIX),
        auction.toBuffer(),
        bidderMeta.toBuffer()
      ],
      MetaplexProgram.PUBKEY
    )
  )[0];
};
