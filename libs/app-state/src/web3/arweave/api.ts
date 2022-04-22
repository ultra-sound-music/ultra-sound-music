import { getAssetUrl } from './utils';
import { getArweave, getArweaveWallet } from './registry';

export async function connect() {
  const wallet = getArweaveWallet();
  return wallet.connect();
}

export async function disconnect() {
  const wallet = getArweaveWallet();
  return wallet.disconnect();
}

export async function upload(data: ArrayBuffer) {
  const arweave = await getArweave();
  const wallet = getArweaveWallet();

  // eslint-disable-next-line prefer-const
  let tx = await arweave.createTransaction({ data });
  await wallet.sign(tx);
  const uploader = await arweave.transactions.getUploader(tx, data);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    );
  }

  // @TODO VERIFY STATUS
  return {
    url: getAssetUrl(tx.id),
    uploader,
    transaction: tx
  };
}

export async function loadWalletData(account: string) {
  const arweave = getArweave();
  return (await arweave).wallets.getBalance(account);
}
