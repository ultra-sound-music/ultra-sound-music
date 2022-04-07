import { useState } from 'react';
import { useAccountAddress, useNetworkStatus } from './models/wallet';
import { useConnect } from './hooks';
import { initWallet, initConnection } from './registry';
import { useEffect } from 'react';

export function useSolanaInit() {
  const [isReady, setIsReady] = useState(false);
  const [networkStatus] = useNetworkStatus();
  const accountAddress = useAccountAddress();
  const connect = useConnect();

  useEffect(() => {
    initWallet().then(() => {
      setIsReady(true);
    });

    initConnection();
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
