import { PublicKey, Connection, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import {
  CreateMasterEditionV3,
  DataV2,
  Creator,
  MasterEdition,
  Metadata,
  CreateMetadataV2
} from '@metaplex-foundation/mpl-token-metadata';
import { actions, Wallet } from '@metaplex/js';

import {
  TransactionsBatch,
  withTransactionInterface,
  prepareTokenAccountAndMintTxs
} from '../utils';

export type RawCreator = {
  address: string;
  share: number;
};

export type RawMetadata = {
  name: string;
  symbol: string;
  seller_fee_basis_points: number;
  properties: {
    creators: RawCreator[];
  };
};

export type MintNftTransactionData = {
  mintPk: PublicKey;
  metadataPk: PublicKey;
  transaction?: Transaction;
};

export type MintNftArgs = {
  connection: Connection;
  wallet: Wallet;
  metadataUri: string;
};

/** Parameters for {@link mintNFT} **/
export interface CreateMintNftTransactionArgs {
  connection: Connection;
  /** Wallet of the NFT creator (IFF different from the payer) **/
  creator?: PublicKey;
  /** Wallet of the NFT creator and fee payer for the minting action **/
  payer: PublicKey;
  /** URI for a json file compatible with the {@link MetadataJson} format. Note that the `properties` field has to contain at least one creator and one of the provided creators must have the same public key as the provided {@link wallet} **/
  uri: string;
  /** Maximum supply of limited edition prints that can be created from the master edition of the minted NFT **/
  maxSupply?: number;
}

export interface MintNFTResponse {
  txId: string;
  mint: PublicKey;
  metadata: PublicKey;
  edition: PublicKey;
}

const { sendTransaction } = actions;

export async function createMintNftTransaction({
  connection,
  payer,
  creator,
  uri,
  maxSupply
}: CreateMintNftTransactionArgs) {
  if (!(payer instanceof PublicKey)) {
    return;
  }

  if (!(creator instanceof PublicKey)) {
    creator = payer;
  }

  const { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx } =
    await prepareTokenAccountAndMintTxs(connection, payer, creator, true);

  const metadataPDA = await Metadata.getPDA(mint.publicKey);
  const editionPDA = await MasterEdition.getPDA(mint.publicKey);

  const {
    name,
    symbol,
    seller_fee_basis_points,
    properties: { creators }
  }: RawMetadata = await fetch(uri).then((response) => response.json());

  const creatorAddress = creator.toBase58();
  creators as RawCreator[];
  const creatorsData = creators?.reduce<Creator[]>((memo, { address, share }) => {
    const verified = address === creatorAddress;
    const creator = new Creator({
      address,
      share,
      verified
    });

    memo = [...memo, creator];

    return memo;
  }, []);

  const metadataData = new DataV2({
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: seller_fee_basis_points,
    creators: creatorsData,
    collection: null, // @TODO
    uses: null // @TODO
  });

  const createMetadataTx = new CreateMetadataV2(
    {
      feePayer: payer
    },
    {
      metadata: metadataPDA,
      metadataData,
      updateAuthority: creator,
      mint: mint.publicKey,
      mintAuthority: creator
    }
  );

  // TEMP @HACK bc CreateMetadataV2 incorrectly sets the wrong isWriteable value
  const createMetadataIx = createMetadataTx.instructions.at(0);
  if (createMetadataIx) {
    const key = createMetadataIx.keys[3];
    if (typeof key === 'object') {
      key.isWritable = true;
    }
  }

  const masterEditionTx = new CreateMasterEditionV3(
    { feePayer: payer },
    {
      edition: editionPDA,
      metadata: metadataPDA,
      updateAuthority: creator,
      mint: mint.publicKey,
      mintAuthority: creator,
      maxSupply: maxSupply || maxSupply === 0 ? new BN(maxSupply) : undefined
    }
  );

  // TEMP @HACK bc CreateMasterEditionV3 incorrectly sets the wrong isWriteable value
  const createMasterEditionIx = masterEditionTx.instructions.at(0);
  if (createMasterEditionIx) {
    const key = createMasterEditionIx.keys[4];
    if (typeof key === 'object') {
      key.isWritable = true;
    }
  }

  const txBatch = new TransactionsBatch({ transactions: [] });
  txBatch.addTransaction(createMintTx);
  txBatch.addTransaction(createMetadataTx);
  txBatch.addTransaction(createAssociatedTokenAccountTx);
  txBatch.addTransaction(mintToTx);
  txBatch.addTransaction(masterEditionTx);
  txBatch.addSigner(mint);

  return {
    transaction: txBatch,
    mintPk: mint.publicKey,
    metadataPk: metadataPDA
  };
}

export async function mintNft({ connection, wallet, metadataUri }: MintNftArgs) {
  const results = await createMintNftTransaction({
    connection,
    payer: wallet.publicKey,
    uri: metadataUri,
    maxSupply: 1
  });

  if (!results) {
    return;
  }

  const { transaction, mintPk, metadataPk } = results;

  const txId = await sendTransaction({
    connection,
    signers: transaction.signers,
    txs: transaction.toTransactions(),
    wallet
  });

  return withTransactionInterface<MintNftTransactionData>(
    connection,
    { txId },
    { mintPk, metadataPk }
  );
}

export async function mintParticipationNft({ connection, wallet, metadataUri }: MintNftArgs) {
  const results = await createMintNftTransaction({
    connection,
    payer: wallet.publicKey,
    uri: metadataUri
  });

  if (!results) {
    return;
  }

  const { transaction, mintPk, metadataPk } = results;

  const txId = await sendTransaction({
    connection,
    signers: transaction.signers,
    txs: transaction.toTransactions(),
    wallet
  });

  return withTransactionInterface<MintNftTransactionData>(
    connection,
    { txId },
    { mintPk, metadataPk }
  );
}
