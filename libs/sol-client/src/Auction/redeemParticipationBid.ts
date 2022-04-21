import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { actions, Wallet } from '@metaplex/js';
import { Connection } from '../Connection';
import { TransactionInterface, TransactionsBatch, withTransactionInterface } from '../utils';
import { getBidRedemptionPDA } from './redeemBid';
import { Auction, AuctionExtended, BidderMetadata } from '@metaplex-foundation/mpl-auction';
import { Vault } from '@metaplex-foundation/mpl-token-vault';
import {
  AuctionManager,
  PrizeTrackingTicket,
  RedeemParticipationBidV3,
  SafetyDepositConfig
} from '@metaplex-foundation/mpl-metaplex';
import {
  Edition,
  EditionMarker,
  MasterEdition,
  Metadata,
  UpdatePrimarySaleHappenedViaToken
} from '@metaplex-foundation/mpl-token-metadata';

const {
  createApproveTxs,
  createWrappedAccountTxs,
  prepareTokenAccountAndMintTxs,
  sendTransaction
} = actions;

export interface RedeemParticipationBidV3Params {
  connection: Connection;
  wallet: Wallet;
  auction: PublicKey;
  store: PublicKey;
}

export const redeemParticipationBid = async ({
  connection,
  wallet,
  store,
  auction
}: RedeemParticipationBidV3Params): Promise<TransactionInterface> => {
  const txInitBatch = new TransactionsBatch({ transactions: [] });
  const txMainBatch = new TransactionsBatch({ transactions: [] });

  const bidder = wallet.publicKey;
  const {
    data: { bidState }
  } = await Auction.load(connection, auction);
  const auctionManagerPDA = await AuctionManager.getPDA(auction);
  const manager = await AuctionManager.load(connection, auctionManagerPDA);
  const vault = await Vault.load(connection, manager.data.vault);
  const auctionExtendedPDA = await AuctionExtended.getPDA(vault.pubkey);
  const safetyDepositBoxes = await vault.getSafetyDepositBoxes(connection);
  const participationBox = safetyDepositBoxes.find(
    (box) => box.data.order === Math.min(1, safetyDepositBoxes.length - 1)
  );

  if (!participationBox) {
    throw new Error('Vault is missing the participation NFT');
  }

  const originalMint = new PublicKey(participationBox.data.tokenMint);
  const safetyDepositTokenStore = new PublicKey(participationBox.data.store);
  const bidderMetaPDA = await BidderMetadata.getPDA(auction, bidder);
  const bidRedemptionPDA = await getBidRedemptionPDA(auction, bidderMetaPDA);
  const safetyDepositConfigPDA = await SafetyDepositConfig.getPDA(
    auctionManagerPDA,
    participationBox.pubkey
  );

  const acceptPaymentAccount = new PublicKey(manager.data.acceptPayment);

  const { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx, recipient } =
    await prepareTokenAccountAndMintTxs(connection, wallet.publicKey);

  txInitBatch.addSigner(mint);
  txInitBatch.addTransaction(createMintTx);
  txInitBatch.addTransaction(createAssociatedTokenAccountTx);
  txInitBatch.addTransaction(mintToTx);

  const newMint = mint.publicKey;
  const newMetadataPDA = await Metadata.getPDA(newMint);
  const newEditionPDA = await Edition.getPDA(newMint);

  const metadataPDA = await Metadata.getPDA(originalMint);
  const masterEditionPDA = await MasterEdition.getPDA(originalMint);
  const masterEdition = await MasterEdition.load(connection, masterEditionPDA);

  const prizeTrackingTicketPDA = await PrizeTrackingTicket.getPDA(auctionManagerPDA, originalMint);

  // this account doesn't exist when we do redeem for the first time
  // @TODO - I saw mentioned as an issue somewhere not sure if it's actually a thing but throwing
  // in here just in case, at least until we can get the redemptions to go through
  try {
    await PrizeTrackingTicket.load(connection, prizeTrackingTicketPDA);
  } catch (e) {
    console.error(e);
  }

  const winIndexNum = bidState.getWinnerIndex(bidder.toBase58());
  const winIndex = Number.isFinite(winIndexNum) ? new BN(winIndexNum as number) : null;

  const desiredEdition = masterEdition.data.supply.add(new BN(1));
  const editionMarkerPDA = await EditionMarker.getPDA(originalMint, desiredEdition);

  const { account, createTokenAccountTx, closeTokenAccountTx } = await createWrappedAccountTxs(
    connection,
    bidder,
    0
  );
  const tokenPaymentAccount = account.publicKey;
  txInitBatch.addTransaction(createTokenAccountTx);
  txInitBatch.addSigner(account);
  txMainBatch.addAfterTransaction(closeTokenAccountTx);

  const { authority, createApproveTx, createRevokeTx } = createApproveTxs({
    account: tokenPaymentAccount,
    owner: bidder,
    amount: 0
  });
  txMainBatch.addTransaction(createApproveTx);
  txMainBatch.addAfterTransaction(createRevokeTx);
  txMainBatch.addSigner(authority);

  const redeemParticipationBidV3Tx = new RedeemParticipationBidV3(
    { feePayer: bidder },
    {
      store,
      vault: vault.pubkey,
      auction,
      auctionManager: auctionManagerPDA,
      bidRedemption: bidRedemptionPDA,
      bidMetadata: bidderMetaPDA,
      safetyDepositTokenStore,
      destination: recipient,
      safetyDeposit: participationBox.pubkey,
      bidder,
      safetyDepositConfig: safetyDepositConfigPDA,
      auctionExtended: auctionExtendedPDA,
      newMint,
      newEdition: newEditionPDA,
      newMetadata: newMetadataPDA,
      metadata: metadataPDA,
      masterEdition: masterEditionPDA,
      editionMark: editionMarkerPDA,
      prizeTrackingTicket: prizeTrackingTicketPDA,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      winIndex,
      transferAuthority: authority.publicKey,
      tokenPaymentAccount,
      acceptPaymentAccount
    }
  );
  txMainBatch.addTransaction(redeemParticipationBidV3Tx);

  const updatePrimarySaleHappenedViaTokenTx = new UpdatePrimarySaleHappenedViaToken(
    { feePayer: bidder },
    {
      metadata: newMetadataPDA,
      owner: bidder,
      tokenAccount: recipient
    }
  );
  txMainBatch.addTransaction(updatePrimarySaleHappenedViaTokenTx);

  const initTxId = await sendTransaction({
    connection,
    wallet,
    txs: txInitBatch.toTransactions(),
    signers: txInitBatch.signers
  });

  // wait for all accounts to be created
  await connection.confirmTransaction(initTxId, 'finalized');

  const mainTxId = await sendTransaction({
    connection,
    wallet,
    txs: txMainBatch.toTransactions(),
    signers: txMainBatch.signers
  });

  return withTransactionInterface(connection, { txIds: [initTxId, mainTxId] });
};
