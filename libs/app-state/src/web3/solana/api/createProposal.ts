import {
  getGovernance,
  getTokenOwnerRecordAddress,
  getGovernanceProgramVersion,
  RpcContext,
  getRealm,
  serializeInstructionToBase64,
  ProgramAccount,
  Governance
} from '@solana/spl-governance';
import {
  createProposal as coreCreateProposal,
  InstructionDataWithHoldUpTime,
  PublicKey,
  RpcConnection,
  TransactionsBatch,
  Transaction
} from '@usm/sol-client';
import configs from '@usm/config';

import { getConnection, getWallet } from '../registry';

export interface CreateProposalArgs {
  payer: string;
  owner: string;
  transaction: Transaction | TransactionsBatch;
  name: string;
  description: string;
}

export async function createProposal({
  payer,
  owner,
  transaction,
  name,
  description
}: CreateProposalArgs) {
  const connection = getConnection();
  const wallet = await getWallet();
  if (wallet.publicKey === null) {
    return;
  }

  const walletPk = wallet.publicKey;
  const payerPk = new PublicKey(payer);
  const ownerPk = new PublicKey(owner);
  const governance = await getGovernance(connection, ownerPk);
  const realmPk = governance.account.realm;

  const realm = await getRealm(connection, realmPk);
  const governanceProgramPk = realm.owner;
  const councilTokenPk = realm.account.config.councilMint;

  const tokenOwnerRecordPk = await getTokenOwnerRecordAddress(
    governanceProgramPk,
    realmPk,
    councilTokenPk as PublicKey,
    walletPk
  );

  const isDraft = false;
  const instructionsData = isBatchedTransaction(transaction)
    ? parseBatchToInstructions(transaction, governance)
    : undefined; // @TODO

  if (!instructionsData) {
    return;
  }

  const signers = isBatchedTransaction(transaction) ? transaction.signers : []; // @TODO

  const governanceProgramVersion = await getGovernanceProgramVersion(
    connection,
    governanceProgramPk
  );
  const rpcContext = new RpcContext(
    governanceProgramPk,
    governanceProgramVersion,
    wallet,
    connection,
    configs.solanaRpc
  ) as RpcConnection;

  return coreCreateProposal(
    rpcContext,
    realm,
    ownerPk,
    tokenOwnerRecordPk,
    name,
    description,
    councilTokenPk as PublicKey,
    governance.account.proposalCount,
    instructionsData,
    signers,
    isDraft
  );
}

function parseBatchToInstructions(
  txBatch: TransactionsBatch,
  governance: ProgramAccount<Governance>
): InstructionDataWithHoldUpTime[] | undefined {
  const isValid = true; // @TODO validate the instruction
  const instructions = txBatch.toInstructions();
  return instructions.map((ix) => {
    const instruction = new InstructionDataWithHoldUpTime({
      instruction: {
        serializedInstruction: serializeInstructionToBase64(ix),
        isValid,
        governance
      },
      governance
    });

    instruction.signers = txBatch.signers;
    return instruction;
  });
}

export function isBatchedTransaction(tx: TransactionsBatch | Transaction): tx is TransactionsBatch {
  return !!(tx as TransactionsBatch).transactions;
}

// function getInstructions(
//   transaction: Transaction | TransactionsBatch,
//   governance: ProgramAccount<Governance>
// ): InstructionDataWithHoldUpTime[] | undefined {
//   const isValid = true; // @TODO validate the instruction
//   if ((transaction as TransactionsBatch).transactions) {
//     const transactions = (transaction as TransactionsBatch).transactions;
//     return transactions.flatMap((tx) =>
//       tx.instructions.map(
//         (ix) => {
//           const instruction = new InstructionDataWithHoldUpTime({
//             instruction: {
//               serializedInstruction: serializeInstructionToBase64(ix),
//               isValid,
//               governance
//             },
//             governance
//           })

//           instruction.signers = (transaction as TransactionsBatch).signers
//           return instruction;
//         }
//       )
//     );
//   }

//   return;
// }
