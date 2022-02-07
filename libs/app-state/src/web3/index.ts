import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback
} from 'recoil';

import SolClient from '@usm/sol-client';

import * as ui from '../ui';
import { localStorageEffect } from '../utils';

import * as constants from './constants';

export interface IWeb3State {
  accountAddress: string;
  networkStatus: string;
  networkId: string;
  isConnected: boolean;
}

export type IUpdateNetworkStateProps = Partial<IWeb3State>;

const solClient = new SolClient();

export const accountAddressState = atom<IWeb3State['accountAddress']>({
  key: 'accountAddressState',
  default: '',
  effects: [localStorageEffect<string>('accountAddress')]
});

export const networkStatusState = atom<IWeb3State['networkStatus']>({
  key: 'networkStatusState',
  default: ''
});

export const networkIdState = atom<IWeb3State['networkId']>({
  key: 'networkIdState',
  default: ''
});

export const isConnectedState = atom<IWeb3State['isConnected']>({
  key: 'isConnectedState',
  default: false
});

export function useGetAccountAddress() {
  return useRecoilValue(accountAddressState);
}

export function useGetShortenedAccountAddress() {
  return useGetAccountAddress();
}

export function useGetNetworkStatus() {
  return useRecoilValue(networkStatusState);
}

export function useGetNetworkId() {
  return useRecoilValue(networkIdState);
}

export function useIsConnected() {
  return !!useRecoilValue(isConnectedState);
}

export function useUpdateNetworkStatus() {
  const setAccountAddress = useSetRecoilState(accountAddressState);
  const setNetworkStatus = useSetRecoilState(networkStatusState);
  const setNetworkId = useSetRecoilState(networkIdState);
  const setIsConnected = useSetRecoilState(isConnectedState);

  return function (props: IUpdateNetworkStateProps) {
    if (accountAddressState) setAccountAddress(props.accountAddress as string);
    if (networkStatusState) setNetworkStatus(props.networkStatus as string);
    if (networkIdState) setNetworkId(props.networkId as string);
    if (isConnectedState) setIsConnected(props.isConnected as boolean);
  };
}

export function useConnect() {
  const showModal = ui.useShowModal();
  const updateNetworkStatus = useUpdateNetworkStatus();

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          updateNetworkStatus({
            networkStatus: constants.networkStatus.CONNECTING
          });
          const accountAddress = await solClient.connectWallet();
          updateNetworkStatus({
            accountAddress,
            networkStatus: constants.networkStatus.CONNECTED,
            networkId: '',
            isConnected: true
          });
        } catch (error) {
          updateNetworkStatus({
            networkStatus: constants.networkStatus.NOT_CONNECTED
          });

          const modalBody = 'there was an errror';
          const modalProps = {
            title: 'Failed to connect',
            body: modalBody
          };

          showModal(modalProps);
        }
      },
    []
  );
}

export function useDisconnect() {
  const showModal = ui.useShowModal();
  const updateNetworkStatus = useUpdateNetworkStatus();

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          await solClient.disconnectWallet();
          updateNetworkStatus({
            accountAddress: '',
            networkStatus: constants.networkStatus.NOT_CONNECTED,
            networkId: '',
            isConnected: false
          });
        } catch (error) {
          const modalBody = 'there was an errror';
          const modalProps = {
            title: 'Failed disconnecting',
            body: modalBody
          };

          showModal(modalProps);
        }
      },
    []
  );
}
