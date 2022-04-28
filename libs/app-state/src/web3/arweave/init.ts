import { useEffect } from 'react';
import isNil from 'lodash/isNil';

import logger from '@usm/util-logger';
import configs from '@usm/config';

import { useNetworkStatus } from './models';
import { initArweave, initArweaveWallet } from './registry';
import { setOrigin } from './utils';

const defaultARImage = 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg';

export interface ArweaveInitializerArgs {
  appName: string;
  logo?: string;
}

export default function ({
  appName = 'Arweave Client',
  logo = defaultARImage
}: ArweaveInitializerArgs) {
  if (isNil(configs.arweaveProtocol) || isNil(configs.arweaveHost) || isNil(configs.arweavePort)) {
    throw new Error('Arweave has not been configured');
  }

  const [, setNetworkStatus] = useNetworkStatus();
  const originConfigs = {
    protocol: configs.arweaveProtocol,
    host: configs.arweaveHost,
    port: configs.arweavePort
  };
  setOrigin(originConfigs);

  useEffect(() => {
    try {
      setNetworkStatus('INITIALIZING');
      initArweave(originConfigs).then(() => {
        setNetworkStatus('INITIALIZED');
      });
    } catch (error) {
      logger.error(error);
      setNetworkStatus('ERRORED');
    }

    try {
      initArweaveWallet(appName, logo);
    } catch (error) {
      logger.error(error);
    }
  }, []);

  // TEMPORARY DISABLED TO PREVENT AUTOCONNECT MODAL WHEN DEV
  // useEffect(() => {
  //   if (accountAddress && network.status === 'INITIALIZED') {
  //     connect();
  //   }
  // }, [network.status]);
}
