import { Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

import {
  getGovernanceProgramVersion,
  getInstructionDataFromBase64,
  getSignatoryRecordAddress,
  Governance,
  ProgramAccount,
  Realm,
  VoteType,
  withCreateProposal
} from '@solana/spl-governance';
import { Wallet } from '@metaplex/js';

import {
  Commitment,
  Connection,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  TransactionSignature
} from '@solana/web3.js';

import { getUnixTs } from '../utils';

class TransactionError extends Error {
  public txid: string;
  constructor(message: string, txid?: string) {
    super(message);
    this.txid = txid!;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEFAULT_TIMEOUT = 31000;

import { withAddSignatory } from '@solana/spl-governance';
import { RpcContext } from '@solana/spl-governance';
import { withInsertTransaction } from '@solana/spl-governance';
import { InstructionData } from '@solana/spl-governance';
import { withSignOffProposal } from '@solana/spl-governance';
import { sendTransactions, SequenceType } from '../utils';
// do we need this? import { VotingClient } from '@utils/uiTypes/VotePlugin'

import { chunks } from '../utils';

export interface UiInstruction {
  serializedInstruction: string;
  isValid: boolean;
  governance: ProgramAccount<Governance> | undefined;
  customHoldUpTime?: number;
  prerequisiteInstructions?: TransactionInstruction[];
  chunkSplitByDefault?: boolean;
  signers?: Keypair[];
  shouldSplitIntoSeparateTxs?: boolean | undefined;
}

export interface InstructionDataWithHoldUpTime {
  data: InstructionData | null;
  holdUpTime: number | undefined;
  prerequisiteInstructions: TransactionInstruction[];
  chunkSplitByDefault?: boolean;
  signers?: Keypair[];
  shouldSplitIntoSeparateTxs?: boolean | undefined;
}

// Fixes typescript
export interface RpcConnection extends RpcContext {
  wallet: Wallet;
}

export class InstructionDataWithHoldUpTime {
  constructor({
    instruction,
    governance
  }: {
    instruction: UiInstruction;
    governance?: ProgramAccount<Governance>;
  }) {
    this.data = instruction.serializedInstruction
      ? getInstructionDataFromBase64(instruction.serializedInstruction)
      : null;
    this.holdUpTime =
      typeof instruction.customHoldUpTime !== undefined
        ? instruction.customHoldUpTime
        : governance?.account?.config.minInstructionHoldUpTime;

    this.prerequisiteInstructions = instruction.prerequisiteInstructions || [];
    this.chunkSplitByDefault = instruction.chunkSplitByDefault || false;
  }
}

export async function createProposal(
  { connection, wallet, programId, walletPubkey }: RpcConnection,
  realm: ProgramAccount<Realm>,
  governance: PublicKey,
  tokenOwnerRecord: PublicKey,
  name: string,
  descriptionLink: string,
  governingTokenMint: PublicKey,
  proposalIndex: number,
  instructionsData: InstructionDataWithHoldUpTime[],
  signersPropThatMayNoLongerBeNeeded: Keypair[],
  isDraft: boolean
  // client?: VotingClient is this necessary?
): Promise<PublicKey> {
  const instructions: TransactionInstruction[] = [];

  const governanceAuthority = walletPubkey;
  const signatory = walletPubkey;
  const payer = walletPubkey;
  const notificationTitle = isDraft ? 'proposal draft' : 'proposal';
  const prerequisiteInstructions: TransactionInstruction[] = [];
  const signers: Keypair[] = instructionsData.flatMap((x) => x.signers ?? []);
  const shouldSplitIntoSeparateTxs: boolean = instructionsData
    .flatMap((x) => x.shouldSplitIntoSeparateTxs)
    .some((x) => x);

  // Explicitly request the version before making RPC calls to work around race conditions in resolving
  // the version for RealmInfo
  const programVersion = await getGovernanceProgramVersion(connection, programId);

  // V2 Approve/Deny configuration
  const voteType = VoteType.SINGLE_CHOICE;
  const options = ['Approve'];
  const useDenyOption = true;

  //will run only if plugin is connected with realm
  // const plugin = await client?.withUpdateVoterWeightRecord(instructions, 'createProposal');  @TODO do we need this?

  const proposalAddress = await withCreateProposal(
    instructions,
    programId,
    programVersion,
    realm.pubkey!,
    governance,
    tokenOwnerRecord,
    name,
    descriptionLink,
    governingTokenMint,
    governanceAuthority,
    proposalIndex,
    voteType,
    options,
    useDenyOption,
    payer
    // plugin?.voterWeightPk @TODO do we need this?
  );

  await withAddSignatory(
    instructions,
    programId,
    programVersion,
    proposalAddress,
    tokenOwnerRecord,
    governanceAuthority,
    signatory,
    payer
  );

  // TODO: Return signatoryRecordAddress from the SDK call
  const signatoryRecordAddress = await getSignatoryRecordAddress(
    programId,
    proposalAddress,
    signatory
  );

  const insertInstructions: TransactionInstruction[] = [];
  const splitToChunkByDefault = instructionsData.filter((x) => x.chunkSplitByDefault).length;

  for (const [index, instruction] of instructionsData.filter((x) => x.data).entries()) {
    if (instruction.data) {
      if (instruction.prerequisiteInstructions) {
        prerequisiteInstructions.push(...instruction.prerequisiteInstructions);
      }
      await withInsertTransaction(
        insertInstructions,
        programId,
        programVersion,
        governance,
        proposalAddress,
        tokenOwnerRecord,
        governanceAuthority,
        index,
        0,
        instruction.holdUpTime || 0,
        [instruction.data],
        payer
      );
    }
  }

  const insertInstructionCount = insertInstructions.length;

  if (!isDraft) {
    withSignOffProposal(
      insertInstructions, // SingOff proposal needs to be executed after inserting instructions hence we add it to insertInstructions
      programId,
      programVersion,
      realm.pubkey,
      governance,
      proposalAddress,
      signatory,
      signatoryRecordAddress,
      undefined
    );
  }

  if (shouldSplitIntoSeparateTxs) {
    const transaction1 = new Transaction();
    const transaction2 = new Transaction();

    transaction1.add(...prerequisiteInstructions, ...instructions);
    transaction2.add(...insertInstructions);

    await sendTransaction({
      transaction: transaction1,
      wallet,
      connection,
      signers,
      sendingMessage: `creating ${notificationTitle}`,
      successMessage: `${notificationTitle} created`
    });

    await sendTransaction({
      transaction: transaction2,
      wallet,
      connection,
      signers: undefined,
      sendingMessage: `inserting into ${notificationTitle}`,
      successMessage: `inserted into ${notificationTitle}`
    });
  } else if (insertInstructionCount <= 2 && !splitToChunkByDefault) {
    // This is an arbitrary threshold and we assume that up to 2 instructions can be inserted as a single Tx
    // This is conservative setting and we might need to revise it if we have more empirical examples or
    // reliable way to determine Tx size
    const transaction = new Transaction();
    // We merge instructions with prerequisiteInstructions
    // Prerequisite  instructions can came from instructions as something we need to do before instruction can be executed
    // For example we create ATAs if they don't exist as part of the proposal creation flow
    transaction.add(...prerequisiteInstructions, ...instructions, ...insertInstructions);

    await sendTransaction({
      transaction,
      wallet,
      connection,
      signers: undefined
    });
  } else {
    const insertChunks = chunks(insertInstructions, 2);
    const signerChunks = Array(insertChunks.length).fill([]);

    console.log(`Creating proposal using ${insertChunks.length} chunks`);

    await sendTransactions(
      connection,
      wallet,
      [prerequisiteInstructions, instructions, ...insertChunks],
      [[], [], ...signerChunks],
      SequenceType.Sequential
    );
  }

  return proposalAddress;
}

export async function sendTransaction({
  transaction,
  wallet,
  signers = [],
  connection,
  sendingMessage = 'Sending transaction...',
  successMessage = 'Transaction confirmed',
  timeout = DEFAULT_TIMEOUT
}: {
  transaction: Transaction;
  wallet: Wallet;
  signers?: Array<Keypair>;
  connection: Connection;
  sendingMessage?: string;
  successMessage?: string;
  timeout?: number;
}) {
  const signedTransaction = await signTransaction({
    transaction,
    wallet,
    signers,
    connection
  });

  return await sendSignedTransaction({
    signedTransaction,
    connection,
    sendingMessage,
    successMessage,
    timeout
  });
}

export async function signTransaction({
  transaction,
  wallet,
  signers = [],
  connection
}: {
  transaction: Transaction;
  wallet: Wallet;
  signers?: Array<Keypair>;
  connection: Connection;
}) {
  transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
  transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));
  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }
  return await wallet.signTransaction(transaction);
}

export async function signTransactions({
  transactionsAndSigners,
  wallet,
  connection
}: {
  transactionsAndSigners: {
    transaction: Transaction;
    signers?: Array<Keypair>;
  }[];
  wallet: Wallet;
  connection: Connection;
}) {
  const blockhash = (await connection.getRecentBlockhash('max')).blockhash;
  transactionsAndSigners.forEach(({ transaction, signers = [] }) => {
    transaction.recentBlockhash = blockhash;
    transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));
    if (signers?.length > 0) {
      transaction.partialSign(...signers);
    }
  });
  return await wallet.signAllTransactions(
    transactionsAndSigners.map(({ transaction }) => transaction)
  );
}

async function sendSignedTransaction({
  signedTransaction,
  connection,
  sendingMessage = 'Sending transaction...',
  successMessage = 'Transaction confirmed',
  timeout = DEFAULT_TIMEOUT
}: {
  signedTransaction: Transaction;
  connection: Connection;
  sendingMessage?: string;
  successMessage?: string;
  timeout?: number;
}): Promise<string> {
  // debugger
  console.log('raw tx');
  const rawTransaction = signedTransaction.serialize();
  const startTime = getUnixTs();

  console.log('raw tx', rawTransaction);

  const txid: TransactionSignature = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true
  });
  console.log('notify2');

  console.log('Started awaiting confirmation for', txid);

  let done = false;

  (async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true
      });

      await sleep(3000);
    }
  })();

  try {
    console.log('calling confirmation sig', txid, timeout, connection);

    console.log(
      'calling signatures confirmation',
      await awaitTransactionSignatureConfirmation(txid, timeout, connection)
    );
  } catch (err) {
    if (timeout in (err as Error)) {
      throw new Error('Timed out awaiting confirmation on transaction');
    }

    let simulateResult: SimulatedTransactionResponse | null = null;

    console.log('sined transaction', signedTransaction);

    try {
      console.log('start simulate');
      simulateResult = (await simulateTransaction(connection, signedTransaction, 'single')).value;
    } catch (error) {
      console.log('Error simulating: ', error);
    }

    console.log('simulate result', simulateResult);

    if (simulateResult && simulateResult.err) {
      if (simulateResult.logs) {
        console.log('simulate resultlogs', simulateResult.logs);

        for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
          const line = simulateResult.logs[i];

          if (line.startsWith('Program log: ')) {
            throw new TransactionError(
              'Transaction failed: ' + line.slice('Program log: '.length),
              txid
            );
          }
        }
      }
      throw new TransactionError(JSON.stringify(simulateResult.err), txid);
    }

    console.log('transaction error lasdkasdn');

    throw new TransactionError('Transaction failed', txid);
  } finally {
    done = true;
  }

  console.log('Latency', txid, getUnixTs() - startTime);
  return txid;
}

async function awaitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  timeout: number,
  connection: Connection
) {
  let done = false;
  const result = await new Promise((resolve, reject) => {
    // eslint-disable-next-line
    (async () => {
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        console.log('Timed out for txid', txid);
        reject({ timeout: true });
      }, timeout);
      try {
        connection.onSignature(
          txid,
          (result) => {
            console.log('WS confirmed', txid, result, result.err);
            done = true;
            if (result.err) {
              reject(result.err);
            } else {
              resolve(result);
            }
          },
          connection.commitment
        );
        console.log('Set up WS connection', txid);
      } catch (e) {
        done = true;
        console.log('WS error in setup', txid, e);
      }
      while (!done) {
        // eslint-disable-next-line
        (async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([txid]);

            console.log('signatures cancel proposal', signatureStatuses);

            const result = signatureStatuses && signatureStatuses.value[0];

            console.log('result signatures proosa', result, signatureStatuses);

            if (!done) {
              if (!result) {
                // console.log('REST null result for', txid, result);
              } else if (result.err) {
                console.log('REST error for', txid, result);
                done = true;
                reject(result.err);
              }
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              else if (
                !(
                  result.confirmations ||
                  result.confirmationStatus === 'confirmed' ||
                  result.confirmationStatus === 'finalized'
                )
              ) {
                console.log('REST not confirmed', txid, result);
              } else {
                console.log('REST confirmed', txid, result);
                done = true;
                resolve(result);
              }
            }
          } catch (e) {
            if (!done) {
              console.log('REST connection error: txid', txid, e);
            }
          }
        })();
        await sleep(3000);
      }
    })();
  });
  done = true;
  return result;
}

/** Copy of Connection.simulateTransaction that takes a commitment parameter. */
async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection._disableBlockhashCaching
  );

  console.log('simulating transaction', transaction);

  const signData = transaction.serializeMessage();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData);
  const encodedTransaction = wireTransaction.toString('base64');

  console.log('encoding');
  const config: any = { encoding: 'base64', commitment };
  const args = [encodedTransaction, config];
  console.log('simulating data', args);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const res = await connection._rpcRequest('simulateTransaction', args);

  console.log('res simulating transaction', res);
  if (res.error) {
    throw new Error('failed to simulate transaction: ' + res.error.message);
  }
  return res.result;
}
