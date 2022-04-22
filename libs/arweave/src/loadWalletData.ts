import Arweave from 'arweave';
import { JWKInterface } from './types';

export async function loadWalletData(arweave: Arweave, jwk: JWKInterface) {
  const address = await arweave.wallets.jwkToAddress(jwk);
  const balance = await arweave.wallets.getBalance(address);

  return {
    address,
    balance
  };
}
