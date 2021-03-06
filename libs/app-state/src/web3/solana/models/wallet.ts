import { atom, selector, DefaultValue, useRecoilState } from 'recoil';

import { localStorageEffect } from '../../../utils';
import { AccountAddress } from '../types';

// undefined - No information / no wallet
// INITIALIZING - The state related to the solana network is still being initialized
// INITIALIZED - The wallet is ready
// NOT_CONNECTED - The wallet is ready but it is not connected to the USM Client.
// CONNECTING
// CONNECTED
// ERRORED // Tried to connect but ran into a problem
export type NetworkStatus =
  | 'INITIALIZING'
  | 'INITIALIZED'
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

export const accountAddressState = atom<AccountAddress>({
  key: 'solWallet/accountAddressState',
  default: undefined,
  effects: [localStorageEffect<string>('solana.accountAddress')]
});

export const accountBalanceState = atom<AccountBalance | undefined>({
  key: 'solWallet/accountBalanceState',
  default: undefined
});

export function useAccountAddress() {
  return useRecoilState(accountAddressState);
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
