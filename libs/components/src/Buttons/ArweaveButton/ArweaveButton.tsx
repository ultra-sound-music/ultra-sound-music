import { useEffect } from 'react';

import { NetworkButton } from '@usm/ui';
import { useArweaveConnect, useArweaveDisconnect, useArweaveNetwork } from '@usm/app-state';

export function ArweaveButton() {
  function onDisconnectClick() {
    disconnect();
  }

  function onConnectClick() {
    connect();
  }

  const [{ isConnected, accountAddress, networkStatus }] = useArweaveNetwork();
  const connect = useArweaveConnect();
  const disconnect = useArweaveDisconnect();

  const isConnecting = networkStatus === 'CONNECTING';

  useEffect(() => {
    if (!isConnected && accountAddress) {
      connect();
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
