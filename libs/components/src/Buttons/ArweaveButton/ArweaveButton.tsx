import { useEffect } from 'react';

import { NetworkButton } from '@usm/ui';
import logo from '@usm/assets/img/logo.png';
import {
  useArweaveConnect,
  useArweaveDisconnect,
  useArweaveNetwork,
  web3Constants
} from '@usm/app-state';

export function ArweaveButton() {
  function onDisconnectClick() {
    disconnect;
  }

  function onConnectClick() {
    connect();
  }

  const [{ isConnected, accountAddress, networkStatus }] = useArweaveNetwork();
  const connect = useArweaveConnect();
  const disconnect = useArweaveDisconnect();

  const isConnecting = networkStatus === web3Constants.networkStatus.CONNECTING;

  useEffect(() => {
    if (!isConnected && accountAddress) {
      connect(logo);
    }
  }, []);

  return (
    <NetworkButton
      type='secondary'
      accountAddress={accountAddress}
      isConnecting={isConnecting}
      onConnectClick={onConnectClick}
      onDisconnectClick={onDisconnectClick}
    >
      Connect to Arweave
    </NetworkButton>
  );
}

export default ArweaveButton;
