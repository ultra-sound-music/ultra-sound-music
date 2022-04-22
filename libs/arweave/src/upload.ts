import Arweave from 'arweave';
import { JWKInterface, ArweaveWebWalletInstance, ArweaveWallet } from './types';

export interface UploadArgs {
  arweave: Arweave;
  wallet: ArweaveWallet;
  content: unknown;
}

export async function upload({ arweave, wallet, content }: UploadArgs) {
  // @TODO get contenttype, get content

  debugger;
  // const arTx = await arweave.createTransaction({
  //   data: JSON.stringify(metadata)
  // });

  // const contentType = '';
  // arTx.addTag('App-Name', appName);
  // arTx.addTag('Content-Type', contentType);

  // await wallet.sign(arTx);
  // await arweave.transactions.post(arTx);

  // // get this uri info from the arweave client?
  // const contentUri = `${protocol}://${host}:${port}/${arTx.id}`;
  // console.log(`metadata URI = ${metadataUri}`);
}
