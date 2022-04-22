import { useEffect } from 'react';

import logger from '@usm/util-logger';
import configs from '@usm/config';
import { Cluster } from '@usm/sol-client';

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
    setNetworkStatus('INITIALIZING');
    initWallet().catch((error) => {
      logger.error('Failed to initialize Solana Wallet,', error);
      setNetworkStatus('ERRORED');
    });

    try {
      initConnection(configs.solanaCluster as Cluster);
    } catch (error) {
      logger.error('Failed to initialize Solana Connection,', error);
    }

    initAuctions(configs.auctionOwner, configs.mplAuctionPubKeys).then((auctionAddresses) => {
      if (auctionAddresses) {
        setActiveAuction(auctionAddresses[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (accountAddress && networkStatus === 'INITIALIZING') {
      connect();
    } else if (networkStatus === 'INITIALIZING') {
      setNetworkStatus('INITIALIZED');
    }
  }, [networkStatus]);
}
