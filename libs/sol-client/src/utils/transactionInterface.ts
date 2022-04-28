import {
  Commitment,
  Connection,
  Transaction,
  TransactionSignature,
  RpcResponseAndContext,
  SignatureResult
} from '@solana/web3.js';
import { TransactionsBatch } from './transactionsBatch';

export interface TransactionResult {
  transaction?: TransactionsBatch;
  txIds?: TransactionSignature[];
  txId?: TransactionSignature;
}

export type ConfirmTransactionResult = RpcResponseAndContext<SignatureResult>;
export interface TransactionInterface<T = void> {
  result: TransactionResult;
  confirmTransaction():
    | Promise<ConfirmTransactionResult>
    | Promise<PromiseSettledResult<ConfirmTransactionResult>[]>;
  data: T;
}

// const r = Promise < RpcResponseAndContext < SignatureResult >> [];

export const withTransactionInterface = <T>(
  connection: Connection,
  txResult: TransactionResult,
  data?: T
): TransactionInterface<T> => {
  return {
    result: txResult,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore @TODO - comeback to this
    confirmTransaction: async (commitment: Commitment = 'finalized') => {
      if (Array.isArray(txResult.txIds)) {
        const confirmed = txResult.txIds.map((txId) =>
          connection.confirmTransaction(txId, commitment)
        );

        return Promise.allSettled(confirmed);
      } else if (txResult.txId) {
        return connection.confirmTransaction(txResult.txId, commitment);
      }
    },
    data: data || ({} as T)
  };
};
