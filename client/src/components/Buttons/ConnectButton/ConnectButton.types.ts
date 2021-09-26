export type TConnectButtonProps = IConnectButtonState & IConnectButtonActions;

export interface IConnectButtonState {
  networkStatus: string;
  address: string;
}

export interface IConnectButtonActions {
  connectWallet: () => void;
}
