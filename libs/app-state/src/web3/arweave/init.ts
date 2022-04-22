import { useEffect } from 'react';

import logger from '@usm/util-logger';

import { useNetwork, useAccountAddress } from './models';
import { initArweave, initArweaveWallet } from './registry';
import { useConnect } from './hooks';

const defaultARImage = 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg';

export interface ArweaveInitializerArgs {
  appName: string;
  logo?: string;
}

export default function ({
  appName = 'Arweave Client',
  logo = defaultARImage
}: ArweaveInitializerArgs) {
  const [network, setNetwork] = useNetwork();
  const [accountAddress] = useAccountAddress();
  const connect = useConnect();

  useEffect(() => {
    try {
      initArweave().then(() => {
        setNetwork({
          status: 'INITIALIZED'
          // @TODO networkId: arClient.network
        });
      });
    } catch (error) {
      logger.error(error);
      setNetwork({
        status: 'ERRORED'
      });
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
