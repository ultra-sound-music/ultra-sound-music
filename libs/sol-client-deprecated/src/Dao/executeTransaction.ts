import { Keypair, Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js';

import { getGovernanceProgramVersion, Proposal, ProposalTransaction } from '@solana/spl-governance';

import { withExecuteTransaction } from '@solana/spl-governance';
import { RpcContext, getGovernanceAccounts, pubkeyFilter } from '@solana/spl-governance';
import { ProgramAccount } from '@solana/spl-governance';
import { sendTransaction } from './sendTransaction';

export const executeTransaction = async (
  { connection, wallet, programId }: RpcContext,
  signers: Keypair[] = [],
  governanceAccount: PublicKey,
  proposalAddress: ProgramAccount<Proposal>,
  instruction: ProgramAccount<ProposalTransaction>
) => {
  const instructions: TransactionInstruction[] = [];

  const proposalPk = new PublicKey(proposalAddress);
  const filter = pubkeyFilter(1, proposalPk);
  if (!proposalPk || !filter) {
    return;
  }

  const proposal = await getGovernanceAccounts(connection, programId, ProposalTransaction, [
    filter
  ]);
  const programVersion = await getGovernanceProgramVersion(connection, programId);

  await withExecuteTransaction(
    instructions,
    programId,
    programVersion,
    governanceAccount,
    proposal[0].pubkey,
    instruction.pubkey,
    [instruction.account.getSingleInstruction()]
  );

  const transaction = new Transaction();

  transaction.add(...instructions);
  transaction.partialSign();

  await sendTransaction({
    transaction,
    wallet,
    connection,
    signers,
    sendingMessage: 'Executing instruction',
    successMessage: 'Execution finalized'
  });
};
