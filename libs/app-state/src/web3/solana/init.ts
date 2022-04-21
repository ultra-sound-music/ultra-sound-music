import { useEffect } from 'react';

import logger from '@usm/util-logger';

import { useAccountAddress, useNetworkStatus } from './models/wallet';
import { useConnect } from './hooks';
import { initWallet, initConnection, initAuctions } from './registry';
import { useActiveAuction } from './models/auctions';

export default function () {
  const [networkStatus, setNetworkStatus] = useNetworkStatus();
  const [, setActiveAuction] = useActiveAuction();
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

    initAuctions().then((auctionAddresses) => {
      if (auctionAddresses) {
        setActiveAuction(auctionAddresses[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (accountAddress && networkStatus === 'INITIALIZED') {
      connect();
    }
  }, [networkStatus]);
}
