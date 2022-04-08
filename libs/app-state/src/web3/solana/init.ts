import { useEffect } from 'react';

import logger from '@usm/util-logger';

import { useAccountAddress, useNetworkStatus } from './models/wallet';
import { useConnect } from './hooks';
import { initWallet, initConnection } from './registry';

export default function () {
  const [networkStatus, setNetworkStatus] = useNetworkStatus();
  const accountAddress = useAccountAddress();
  const connect = useConnect();

  useEffect(() => {
    initWallet()
      .then(() => {
        setNetworkStatus('INITIALIZED');
      })
      .catch((error) => {
        logger.error('Failed to initialize Solana Wallet state,', error);
        setNetworkStatus('ERRORED');
      });

    try {
      initConnection();
    } catch (error) {
      logger.error('Failed to initialize Solana Connection state,', error);
    }
  }, []);

  useEffect(() => {
    if (accountAddress && networkStatus === 'INITIALIZED') {
      connect();
    }
  }, [networkStatus]);
}
