import { useState, useEffect } from 'react';

import logger from '@usm/util-logger';
import config from '@usm/config';

import { useAccountAddress, useNetworkStatus } from './models/wallet';
import { useConnect } from './hooks';
import { initWallet, initConnection } from './registry';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(): void {}

function initializer() {
  const [isReady, setIsReady] = useState(false);
  const [networkStatus] = useNetworkStatus();
  const accountAddress = useAccountAddress();
  const connect = useConnect();

  useEffect(() => {
    initWallet()
      .then(() => {
        setIsReady(true);
      })
      .catch((error) => {
        logger.error('Failed to initialize Solana Wallet state,', error);
      });

    try {
      initConnection();
    } catch (error) {
      logger.error('Failed to initialize Solana Connection state,', error);
    }
  }, []);

  useEffect(() => {
    if (
      isReady &&
      accountAddress &&
      networkStatus !== 'CONNECTED' &&
      networkStatus !== 'CONNECTING'
    ) {
      connect();
    }
  }, [isReady]);
}

export const useSolanaInit = config.weAreLive ? initializer : noop;
