import { ArweaveWebWallet } from 'arweave-wallet-connector';

// @TODO - The Arweave client doesn't export these yet
// JWK: https://datatracker.ietf.org/doc/html/rfc7517
export interface JWKPublicInterface {
  kty: string;
  e: string;
  n: string;
}

// @TODO - The Arweave client doesn't export these yet
export interface JWKInterface extends JWKPublicInterface {
  d?: string;
  p?: string;
  q?: string;
  dp?: string;
  dq?: string;
  qi?: string;
}

export type IArweaveWalletEvents = 'connect' | 'disconnect';
export type ArweaveWebWalletInstance = InstanceType<typeof ArweaveWebWallet>;
export type ArweaveWallet = ArweaveWebWalletInstance['namespaces']['arweaveWallet'];
