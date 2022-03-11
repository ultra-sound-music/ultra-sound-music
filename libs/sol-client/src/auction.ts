import { TOKEN_PROGRAM_ID, MintLayout, u64 } from '@solana/spl-token';
import { Auction } from '@metaplex-foundation/mpl-auction';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { Account } from '@metaplex-foundation/mpl-core';
import { Connection, Wallet } from '@metaplex/js';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionSignature
} from '@solana/web3.js';
import { actions } from '@metaplex/js';
import { cancelBid, transformAuctionData, placeBid } from './utils/utils';
import BN from 'bn.js';
const { redeemFullRightsTransferBid, redeemParticipationBidV3 } = actions;

export * from './consts';

export { Auction };

interface IRedeemParticipationBidV3Response {
  txIds: TransactionSignature[];
}

interface IRedeemBidResponse {
  txId: string;
}

export class USMClient {
  connection;
  wallet;
  balance?: number;

  constructor(connection: Connection, wallet: Wallet) {
    this.connection = connection;
    this.wallet = wallet;
  }

  async getAuction(pubKey: PublicKey) {
    return Auction.load(this.connection, pubKey);
  }

  async getWalletBalance() {
    this.balance = await this.connection.getBalance(this.wallet.publicKey);
    this.balance = this.balance / LAMPORTS_PER_SOL;
    return this.balance;
  }

  async getAuctionData(pubKey: PublicKey) {
    const a = await Auction.load(this.connection, pubKey);
    return transformAuctionData(a, this.connection);
  }

  async placeBid(amount: number, auction: PublicKey) {
    if (amount <= 0) {
      return;
    }

    const bidAmount = new BN(amount * LAMPORTS_PER_SOL);
    return placeBid({
      connection: this.connection,
      wallet: this.wallet,
      amount: bidAmount,
      auction
    });
  }

  async cancelBid(auction: PublicKey) {
    return cancelBid({
      connection: this.connection,
      wallet: this.wallet,
      auction
    });
  }

  async redeemParticipationBid(
    store: PublicKey,
    auction: PublicKey
  ): Promise<IRedeemParticipationBidV3Response> {
    return redeemParticipationBidV3({
      connection: this.connection,
      wallet: this.wallet,
      store,
      auction
    });
  }

  async redeemBid(
    store: PublicKey,
    auction: PublicKey
  ): Promise<IRedeemBidResponse> {
    return redeemFullRightsTransferBid({
      connection: this.connection,
      wallet: this.wallet,
      store,
      auction
    });
  }

  async getMint(tokenMint: PublicKey) {
    const info = await this.connection.getAccountInfo(tokenMint);
    if (info === null) {
      throw new Error('Failed to find mint account');
    }
    if (!info.owner.equals(TOKEN_PROGRAM_ID)) {
      throw new Error(`Invalid mint owner: ${JSON.stringify(info.owner)}`);
    }
    if (info.data.length != MintLayout.span) {
      throw new Error(`Invalid mint size`);
    }

    const data = Buffer.from(info.data);
    const mintInfo = MintLayout.decode(data);

    if (mintInfo.mintAuthorityOption === 0) {
      mintInfo.mintAuthority = null;
    } else {
      mintInfo.mintAuthority = new PublicKey(mintInfo.mintAuthority);
    }

    mintInfo.supply = u64.fromBuffer(mintInfo.supply);
    mintInfo.isInitialized = mintInfo.isInitialized != 0;

    if (mintInfo.freezeAuthorityOption === 0) {
      mintInfo.freezeAuthority = null;
    } else {
      mintInfo.freezeAuthority = new PublicKey(mintInfo.freezeAuthority);
    }
    return mintInfo;
  }

  async getMetadata(tokenMint: PublicKey) {
    const metadata = await Metadata.getPDA(tokenMint);
    const metadataInfo = await Account.getInfo(this.connection, metadata);
    const { data } = new Metadata(metadata, metadataInfo).data;
    return data;
  }
}
