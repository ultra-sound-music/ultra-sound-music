import { atom, useRecoilValue, selector, DefaultValue, useRecoilState } from 'recoil';

import { localStorageEffect } from '../../../utils';

// NOT_AVAILABLE - Has wallet but not connected to network
// INSTALLING
// NOT_CONNECTED // Has wallet but the wallet is not connected to the USM Client.
// CONNECTING
// CONNECTED
// ERRORED // Tried to connect but ran into a problem
// undefined - No information / no wallet
export type NetworkStatus =
  | 'NOT_AVAILABLE'
  | 'INSTALLING'
  | 'NOT_CONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'ERRORED'
  | undefined;
export type NetworkId = 'mainnet' | 'devnet' | undefined;
export interface NetworkState {
  networkStatus: NetworkStatus;
  networkId: NetworkId;
}

export type AccountAddress = string;
export type AccountBalance = number;

export const networkStatusState = atom<NetworkStatus>({
  key: 'solNetwork/networkStatusState',
  default: undefined
});

export const networkIdState = atom<NetworkId>({
  key: 'solNetwork/networkIdState',
  default: undefined
});

export const networkState = selector<NetworkState>({
  key: 'solNetwork/networkState',
  get: ({ get }) => {
    return {
      networkStatus: get(networkStatusState),
      networkId: get(networkIdState)
    };
  },
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(networkStatusState);
      reset(networkIdState);
      return;
    }

    set(networkStatusState, newState.networkStatus);
    set(networkIdState, newState.networkId);
  }
});

export const accountAddressState = atom<AccountAddress | undefined>({
  key: 'solWallet/accountAddressState',
  default: undefined,
  effects: [localStorageEffect('accountAddress')]
});

export const accountBalanceState = atom<AccountBalance | undefined>({
  key: 'solWallet/accountBalanceState',
  default: undefined
});

export function useAccountAddress() {
  return useRecoilValue(accountAddressState);
}

export function useAccountBalance() {
  return useRecoilState(accountBalanceState);
}

export function useNetwork() {
  return useRecoilState(networkState);
}

export function useNetworkStatus() {
  return useRecoilState(networkStatusState);
}
