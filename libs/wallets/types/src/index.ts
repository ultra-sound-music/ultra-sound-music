export type INetworkId = number;
export type IPubKeyString = string;

export interface IWeb3Client {
  init?(): Promise<IPubKeyString | null>;
  connectWallet(): Promise<string>;
  getWalletAddress(): Promise<IPubKeyString | null>;
  getNetworkId(): Promise<INetworkId>;
  isConnected(): Promise<boolean>;
  mint(): Promise<string>;
  on(eventName: string, eventHandler: () => void): void;
  off(eventName: string, eventHandler: () => void): void;
}

export interface IWallet {
  init?(): Promise<IPubKeyString | null>;
  connectWallet(): Promise<string>;
  getWalletAddress(): Promise<IPubKeyString | null>;
  getNetworkId(): Promise<INetworkId>;
  isConnected(): Promise<boolean>;
  mint(): Promise<string>;
  on(eventName: string, eventHandler: () => void): void;
  off(eventName: string, eventHandler: () => void): void;
}
