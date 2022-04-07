import {
  Commitment,
  Connection,
  TransactionSignature,
  RpcResponseAndContext,
  SignatureResult
} from '@solana/web3.js';

export interface TransactionResult {
  txIds?: TransactionSignature[];
  txId?: TransactionSignature;
}

export type ConfirmTransactionResult = RpcResponseAndContext<SignatureResult>;
export interface TransactionInterface {
  result: TransactionResult;
  confirmTransaction():
    | Promise<ConfirmTransactionResult>
    | Promise<PromiseSettledResult<ConfirmTransactionResult>[]>;
}

// const r = Promise < RpcResponseAndContext < SignatureResult >> [];

export const withTransactionInterface = (
  connection: Connection,
  txResult: TransactionResult
): TransactionInterface => {
  return {
    result: txResult,
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
    }
  };
};
