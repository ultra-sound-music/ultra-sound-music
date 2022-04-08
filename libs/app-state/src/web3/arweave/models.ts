import { atom, selector, DefaultValue, useRecoilState } from 'recoil';

import { localStorageEffect } from '../../utils';

export interface IArweaveState {
  accountAddress: string;
  networkStatus: string;
  networkId: string;
  isConnected: boolean;
}

const accountAddressState = atom<IArweaveState['accountAddress']>({
  key: 'arAccountAddressState',
  default: '',
  effects: [localStorageEffect<string>('accountAddress')]
});

const networkStatusState = atom<IArweaveState['networkStatus']>({
  key: 'arNetworkStatusState',
  default: ''
});

const networkIdState = atom<IArweaveState['networkId']>({
  key: 'arNetworkIdState',
  default: ''
});

const networkState = selector<Partial<IArweaveState>>({
  key: 'arNetworkState',
  get: ({ get }) => ({
    accountAddress: get(accountAddressState),
    networkStatus: get(networkStatusState),
    networkId: get(networkIdState),
    isConnected: get(networkStatusState) === 'CONNECTED'
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(accountAddressState);
      reset(networkStatusState);
      reset(networkIdState);
      return;
    }

    set(accountAddressState, newState.accountAddress || '');
    set(networkStatusState, newState.networkStatus || '');
    set(networkIdState, newState.networkId || '');
  }
});

export const useArweaveNetwork = () => useRecoilState(networkState);
