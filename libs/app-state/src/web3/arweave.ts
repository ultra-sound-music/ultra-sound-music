import { atom, selector, useRecoilCallback, DefaultValue, useRecoilState } from 'recoil';

import ArweaveClient from '@usm/arweave';

import * as ui from '../ui';
import { localStorageEffect } from '../utils';

import * as web3Constants from './constants';

let arClient: ArweaveClient;

export interface IArweaveState {
  accountAddress: string;
  networkStatus: string;
  networkId: string;
  isConnected: boolean;
}

export function getArweaveClient(logo?: string) {
  if (!arClient) {
    arClient = new ArweaveClient(logo);
  }

  return arClient;
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
    isConnected: get(networkStatusState) === web3Constants.networkStatus.CONNECTED
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

export function useArweaveConnect() {
  const showNotification = ui.useShowNotification();
  const [, setArweaveNetwork] = useArweaveNetwork();

  return useRecoilCallback(
    () => async (logo?: string) => {
      try {
        setArweaveNetwork({
          networkStatus: web3Constants.networkStatus.CONNECTING
        });

        const arClient = getArweaveClient(logo);
        const accountAddress = await arClient.connect();

        if (!accountAddress) {
          return;
        }

        setArweaveNetwork({
          accountAddress,
          networkStatus: web3Constants.networkStatus.CONNECTED,
          networkId: ''
        });
      } catch (error) {
        setArweaveNetwork({
          networkStatus: web3Constants.networkStatus.NOT_CONNECTED
        });

        showNotification({
          title: 'Error',
          message: 'Failed to connect',
          type: 'error'
        });
      }
    },
    []
  );
}

export function useArweaveDisconnect() {
  const showNotification = ui.useShowNotification();
  const [, setArweaveNetwork] = useArweaveNetwork();

  return useRecoilCallback(
    () => async () => {
      try {
        const arClient = getArweaveClient();
        arClient.disconnect();

        setArweaveNetwork({
          accountAddress: '',
          networkStatus: web3Constants.networkStatus.NOT_CONNECTED,
          networkId: ''
        });
      } catch (error) {
        showNotification({
          title: 'Error',
          type: 'error'
        });
      }
    },
    []
  );
}
