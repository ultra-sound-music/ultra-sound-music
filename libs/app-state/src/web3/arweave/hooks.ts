import { useRecoilCallback } from 'recoil';

import logger from '@usm/util-logger';

import * as ui from '../../ui';
import { connect, disconnect, upload, loadWalletData } from './api';
import { useNetwork, useAccountAddress, useAccountBalance, useSetAccountBalance } from './models';

export function useUpload() {
  // @TODO
  const showNotification = ui.useShowNotification();
  const [, setNetwork] = useNetwork();

  return useRecoilCallback(
    () => async (data: ArrayBuffer, type: string) => {
      return upload(data, type);
    },
    []
  );
}

export function useConnect() {
  const showNotification = ui.useShowNotification();
  const setAccountBalance = useSetAccountBalance();
  const [, setAccountAddress] = useAccountAddress();
  const [, setNetwork] = useNetwork();

  return useRecoilCallback(
    () => async () => {
      try {
        setNetwork({
          status: 'CONNECTING'
        });

        const accountAddress = await connect();
        if (!accountAddress) {
          throw new Error('Failed to connect to Arweave');
        }

        setAccountAddress(accountAddress);
        loadWalletData(accountAddress).then((balance) => {
          // @TODO, do a smarter conversion
          setAccountBalance(balance);
        });

        setNetwork({
          status: 'CONNECTED',
          networkId: ''
        });
      } catch (error) {
        logger.error(error);
        setNetwork({
          status: 'ERRORED'
        });

        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to connect'
        });
      }
    },
    []
  );
}

export function useDisconnect() {
  const showNotification = ui.useShowNotification();
  const [, setNetwork] = useNetwork();

  return useRecoilCallback(
    () => async () => {
      try {
        disconnect();

        setNetwork({
          status: 'NOT_CONNECTED',
          networkId: ''
        });
      } catch (error) {
        logger.error(error);
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'There was an error'
        });
      }
    },
    []
  );
}
