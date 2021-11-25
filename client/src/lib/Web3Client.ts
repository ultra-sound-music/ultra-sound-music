// @TODO - DEPRECATE THE USM CLIENT SINCE WE WILL NO LONGER RELY ON A BACKEND

export type INetworkId = number;
export type IPubKeyString = string;

export interface IWeb3Client {
  init?(): Promise<IPubKeyString | null>;
  connectWallet(): Promise<string>;
  getWalletAddress(): Promise<IPubKeyString | null>;
  getNetworkId(): Promise<INetworkId>;
  isConnected(): Promise<boolean>;
  mint(): Promise<string>;
  onAccountChanged(): void;
  onChangedNetwork(): void;
}
