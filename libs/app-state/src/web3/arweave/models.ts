import {
  atom,
  selector,
  DefaultValue,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil';

import { localStorageEffect } from '../../utils';

export type NetworkStatus =
  | 'INSTALLING'
  | 'INITIALIZED'
  | 'NOT_CONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'ERRORED'
  | undefined;

export interface IArweaveState {
  status: NetworkStatus;
  networkId: string;
}

export type AccountAddress = string;
export type AccountBalanceInWinstons = string;
export type AccountBalance = number;

export const WINSTONS_PER_AR = 1000000000000;

const accountAddressState = atom<AccountAddress>({
  key: 'arweaveAccountAddressState',
  default: '',
  effects: [localStorageEffect<string>('arweave.accountAddress')]
});

const accountBalanceInWinstonsState = atom<AccountBalanceInWinstons>({
  key: 'arweaveAccountBalanceInWinstonsState',
  default: ''
});

const accountBalanceState = selector<number>({
  key: 'arweaveAccountBalanceState',
  // @TODO make a smarter conversion
  get: ({ get }) => +get(accountBalanceInWinstonsState) / WINSTONS_PER_AR,
  set: ({ set }, newARBalance) =>
    set(accountBalanceInWinstonsState, (newARBalance as number) * WINSTONS_PER_AR + '')
});

const networkStatusState = atom<NetworkStatus>({
  key: 'arweaveNetworkStatusState',
  default: undefined
});

const networkIdState = atom<IArweaveState['networkId']>({
  key: 'arweaveNetworkIdState',
  default: ''
});

const networkState = selector<Partial<IArweaveState>>({
  key: 'arweaveNetworkState',
  get: ({ get }) => ({
    status: get(networkStatusState),
    networkId: get(networkIdState)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(networkStatusState);
      reset(networkIdState);
      return;
    }

    set(networkStatusState, newState.status);
    set(networkIdState, newState.networkId || '');
  }
});

export const useNetwork = () => useRecoilState(networkState);
export const useNetworkStatus = () => useRecoilState(networkStatusState);
export const useAccountAddress = () => useRecoilState(accountAddressState);
export const useSetAccountBalance = () => useSetRecoilState(accountBalanceInWinstonsState);
export const useAccountBalance = () => useRecoilValue(accountBalanceState);
