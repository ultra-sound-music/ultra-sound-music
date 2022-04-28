import { PublicKey, Connection } from '@solana/web3.js';
import { Wallet, actions } from '@metaplex/js';
import { SetStoreV2, Store, StoreConfig } from '@metaplex-foundation/mpl-metaplex';
import { withTransactionInterface } from '../utils';

const { sendTransaction } = actions;

export interface InitStoreV2Params {
  connection: Connection;
  wallet: Wallet;
  isPublic?: boolean;
  settingsUri?: string | null;
  governanceAccount?: string;
}

export interface InitStoreV2Response {
  storeId: PublicKey;
  configId: PublicKey;
  tx: SetStoreV2;
}

export const createInitStoreTransaction = async ({
  wallet,
  settingsUri = null,
  isPublic = true
}: Omit<InitStoreV2Params, 'connection'>): Promise<InitStoreV2Response> => {
  const storeId = await Store.getPDA(wallet.publicKey);
  const configId = await StoreConfig.getPDA(storeId);
  const tx = new SetStoreV2(
    { feePayer: wallet.publicKey },
    {
      admin: new PublicKey(wallet.publicKey),
      store: storeId,
      config: configId,
      isPublic,
      settingsUri
    }
  );

  return {
    tx,
    storeId,
    configId
  };
};

export async function initStore({
  connection,
  wallet,
  settingsUri = null,
  isPublic = true,
  governanceAccount
}: InitStoreV2Params) {
  if (governanceAccount) {
    const { tx } = await createInitStoreTransaction({
      wallet,
      settingsUri,
      isPublic
    });

    // @TODO send proposal to DAO
  } else {
    const { tx } = await createInitStoreTransaction({
      wallet,
      settingsUri,
      isPublic
    });

    const txId = await sendTransaction({ connection, wallet, txs: [tx] });
    withTransactionInterface(connection, { txId });
  }
}
