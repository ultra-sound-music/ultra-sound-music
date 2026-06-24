import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { transactions } from '@metaplex/js';
import { Transaction } from '@metaplex-foundation/mpl-core';

const { CreateMint, MintTo, CreateAssociatedTokenAccount } = transactions;

interface MintTxs {
  mint: Keypair;
  recipient: PublicKey;
  createMintTx: Transaction;
  createAssociatedTokenAccountTx: Transaction;
  mintToTx: Transaction;
}

export async function prepareTokenAccountAndMintTxs(
  connection: Connection,
  payer: PublicKey,
  owner?: PublicKey,
  allowOwnerOffCurve = false
): Promise<MintTxs> {
  if (!owner) {
    owner = payer;
  }

  const mint = Keypair.generate();
  const mintRent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
  const createMintTx = new CreateMint(
    { feePayer: payer },
    {
      newAccountPubkey: mint.publicKey,
      lamports: mintRent,
      owner,
      freezeAuthority: owner
    }
  );

  const recipient = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint.publicKey,
    owner,
    allowOwnerOffCurve
  );

  const createAssociatedTokenAccountTx = new CreateAssociatedTokenAccount(
    { feePayer: payer },
    {
      associatedTokenAddress: recipient,
      splTokenMintAddress: mint.publicKey,
      walletAddress: owner
    }
  );

  const mintToTx = new MintTo(
    { feePayer: payer },
    {
      mint: mint.publicKey,
      dest: recipient,
      authority: owner,
      amount: 1
    }
  );

  return { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx, recipient };
}
