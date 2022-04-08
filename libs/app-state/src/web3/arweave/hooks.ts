import { useRecoilCallback } from 'recoil';

import logger from '@usm/util-logger';

import * as ui from '../../ui';
import { getArweave } from './registry';
import { useArweaveNetwork } from './models';

export function useArweaveConnect() {
  const showNotification = ui.useShowNotification();
  const [, setArweaveNetwork] = useArweaveNetwork();

  return useRecoilCallback(
    () => async () => {
      try {
        setArweaveNetwork({
          networkStatus: 'CONNECTING'
        });

        const arweave = getArweave();
        const accountAddress = await arweave.connect();

        if (!accountAddress) {
          throw new Error('Failed to connect to Arweave');
        }

        setArweaveNetwork({
          accountAddress,
          networkStatus: 'CONNECTED',
          networkId: ''
        });
      } catch (error) {
        logger.error(error);
        setArweaveNetwork({
          networkStatus: 'ERRORED'
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

export function useArweaveDisconnect() {
  const showNotification = ui.useShowNotification();
  const [, setArweaveNetwork] = useArweaveNetwork();

  return useRecoilCallback(
    () => async () => {
      try {
        const arweave = getArweave();
        arweave.disconnect();

        setArweaveNetwork({
          accountAddress: '',
          networkStatus: 'NOT_CONNECTED',
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
