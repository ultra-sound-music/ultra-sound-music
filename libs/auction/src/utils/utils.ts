import BN from 'bn.js';
import fetch from 'cross-fetch';
import {
  Commitment,
  Keypair,
  PublicKey,
  TransactionSignature,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import { Connection, Wallet, actions } from '@metaplex/js';

import {
  Auction,
  AuctionExtended,
  AuctionProgram,
  AuctionState as AuctionStateEnum,
  BidderMetadata,
  BidderPot,
  BidderMetadataData,
  PlaceBid
} from '@metaplex-foundation/mpl-auction';

import { Vault } from '@metaplex-foundation/mpl-token-vault';

import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { AuctionManager } from '@metaplex-foundation/mpl-metaplex';
import { Transaction, Account } from '@metaplex-foundation/mpl-core';

interface TransactionsBatchParams {
  beforeTransactions?: Transaction[];
  transactions: Transaction[];
  afterTransactions?: Transaction[];
}

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

export interface PlaceBidResponse {
  txId: TransactionSignature;
  bidderPotToken: PublicKey;
  bidderMeta: PublicKey;
}

export type USMBidData = {
  bidder: string;
  bid: number;
  timestamp: number;
  hasBeenRedeemed?: boolean;
  hasRedeemedParticipationToken?: boolean;
  hasBeenRefunded?: boolean;
  won?: boolean;
};

export type NftData = {
  pubKey: PublicKey;
  metadata: any;
};

export type USMAuctionData = {
  pubkey: PublicKey;
  auctionNft: NftData;
  participationNft?: NftData;
  acceptedToken: PublicKey;
  endTimestamp?: EpochTimeStamp;
  state: AuctionState;
  bids: USMBidData[];
};

const { getCancelBidTransactions, createApproveTxs, createWrappedAccountTxs, sendTransaction } =
  actions;

const getBidderPotTokenPDA = async (bidderPotPubKey: PublicKey) => {
  return AuctionProgram.findProgramAddress([
    Buffer.from(AuctionProgram.PREFIX),
    bidderPotPubKey.toBuffer(),
    Buffer.from('bidder_pot_token')
  ]);
};

const auctionStates = ['created', 'started', 'ended'] as const;
export type AuctionState = typeof auctionStates[number];

export class TransactionsBatch {
  beforeTransactions: Transaction[];
  transactions: Transaction[];
  afterTransactions: Transaction[];

  signers: Keypair[] = [];

  constructor({
    beforeTransactions = [],
    transactions,
    afterTransactions = []
  }: TransactionsBatchParams) {
    this.beforeTransactions = beforeTransactions;
    this.transactions = transactions;
    this.afterTransactions = afterTransactions;
  }

  addSigner(signer: Keypair) {
    this.signers.push(signer);
  }

  addBeforeTransaction(transaction: Transaction) {
    this.beforeTransactions.push(transaction);
  }

  addTransaction(transaction: Transaction) {
    this.transactions.push(transaction);
  }

  addAfterTransaction(transaction: Transaction) {
    this.afterTransactions.push(transaction);
  }

  toTransactions() {
    return [...this.beforeTransactions, ...this.transactions, ...this.afterTransactions];
  }

  toInstructions() {
    return this.toTransactions().flatMap((t) => t.instructions);
  }
}

/**
 * Place a bid by moving funds from the provided wallet to the bidder pot account.
 */
export const placeBid = async ({
  connection,
  wallet,
  amount,
  auction
}: PlaceBidParams): Promise<PlaceBidResponse> => {
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

  return { txId, bidderPotToken, bidderMeta };
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

export interface CancelBidResponse {
  txId: string;
}

/**
 * Cancel a bid on a running auction. Any bidder can cancel any time during an auction, but only non-winners of the auction can cancel after it ends. When users cancel, they receive full refunds.
 */
export const cancelBid = async ({
  connection,
  wallet,
  auction,
  destAccount
}: CancelBidParams): Promise<CancelBidResponse> => {
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

  return { txId };
};

export const transformAuctionData = async (
  auction: Auction,
  connection: Connection,
  bidder: PublicKey
): Promise<USMAuctionData | undefined> => {
  const auctionManagerPk = await AuctionManager.getPDA(auction.pubkey);
  const auctionManager = await AuctionManager.load(connection, auctionManagerPk);
  const vault = await Vault.load(connection, new PublicKey(auctionManager.data.vault));
  const boxes = await vault.getSafetyDepositBoxes(connection);

  // The primary NFT will not always be the first in the array of boxes. Maybe "order" will be reliable?
  // The participation NFT, *I think*, is the one with the highest order (you can have > 1 non-participation NFTs)
  const primaryBox = boxes.find((box) => box.data.order === 0);
  const participationBox = boxes.find((box) => box.data.order === boxes.length);

  if (!primaryBox) {
    return;
  }

  const nftPubKey = primaryBox.data.tokenMint;
  const nftData = await getMetadata(new PublicKey(nftPubKey), connection);
  const nftMetadata = await fetch(nftData.uri).then((response) => response.json());

  const participationNftPubKey = participationBox?.data.tokenMint;
  const participationData = participationNftPubKey
    ? await getMetadata(new PublicKey(participationNftPubKey), connection)
    : undefined;
  const participationMetadata = participationData
    ? await fetch(participationData.uri).then((response) => response.json())
    : undefined;

  const auctionState = auction.data.state;
  const maxWinners = auction.data.bidState.max.toNumber();
  const bids = await auction.getBidderMetadata(connection);
  const usmBidData = bids
    .filter((bid) => !isCancelledBid(bid.data, auctionState))
    .sort((a, b) => b.data.lastBid.toNumber() - a.data.lastBid.toNumber())
    .map(({ data }, index) => {
      const bidData: USMBidData = {
        bidder: data.bidderPubkey,
        bid: data.lastBid.toNumber() / LAMPORTS_PER_SOL,
        timestamp: data.lastBidTimestamp.toNumber() * 1000
      };

      if (auctionState === AuctionStateEnum.Ended) {
        return {
          hasBeenRedeemed: false, // @TODO
          hasRedeemedParticipationToken: false, // @TODO
          hasBeenRefunded: !!data.cancelled,
          won: index < maxWinners,
          ...bidData
        };
      }

      return bidData;
    });

  let endTimestamp;
  if (auctionState === AuctionStateEnum.Ended) {
    endTimestamp = auction.data.endedAt ? auction.data.endedAt.toNumber() * 1000 : undefined;
  } else {
    endTimestamp = auction.data.endAuctionAt
      ? auction.data.endAuctionAt.toNumber() * 1000
      : undefined;
  }

  return {
    pubkey: auction.pubkey,
    auctionNft: {
      pubKey: new PublicKey(nftPubKey),
      metadata: nftMetadata
    },
    participationNft: participationNftPubKey
      ? {
          pubKey: new PublicKey(participationNftPubKey),
          metadata: participationMetadata
        }
      : undefined,
    acceptedToken: new PublicKey(auction.data.tokenMint),
    endTimestamp,
    state: auctionStates[auctionState],
    bids: usmBidData
  };
};

export function isCancelledBid(bidderMetaData: BidderMetadataData, auctionState: AuctionStateEnum) {
  return !!bidderMetaData.cancelled && auctionState !== AuctionStateEnum.Ended;
}

export const getMetadata = async (tokenMint: PublicKey, connection: Connection) => {
  const metadata = await Metadata.getPDA(tokenMint);
  const metadataInfo = await Account.getInfo(connection, metadata);
  const { data } = new Metadata(metadata, metadataInfo).data;
  return data;
};
