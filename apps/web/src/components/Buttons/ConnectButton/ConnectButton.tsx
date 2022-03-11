import { useEffect } from 'react';

import { Button } from '@usm/ui';
import {
  useGetShortenedAccountAddress,
  useConnect,
  useDisconnect,
  useNetworkState,
  web3Constants
} from '@usm/app-state';

export default function ConnectButton() {
  function onClick() {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }

  const [{ isConnected, accountAddress, networkStatus }] = useNetworkState();
  const shortenedAccountAddress = useGetShortenedAccountAddress();
  const connect = useConnect();
  const disconnect = useDisconnect();

  const isConnecting = networkStatus === web3Constants.networkStatus.CONNECTING;

  useEffect(() => {
    if (!isConnected && accountAddress) {
      connect();
    }
  }, []);

  return (
    <Button type='primary' onClick={onClick} isProcessing={isConnecting}>
      {isConnected ? shortenedAccountAddress : 'Connect'}
    </Button>
  );
}
