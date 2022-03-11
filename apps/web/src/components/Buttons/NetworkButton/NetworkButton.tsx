import { useEffect } from 'react';

import { Button } from '@usm/ui';
import {
  useGetShortenedAccountAddress,
  useConnect,
  useDisconnect,
  useNetwork,
  useModal,
  web3Constants
} from '@usm/app-state';

export default function ConnectButton() {
  const { showModal, hideModal } = useModal();

  function onDisconnectClick() {
    disconnect();
    hideModal();
  }

  function onConnectClick() {
    connect();
    hideModal();
  }

  function onButtonClick() {
    if (isConnected) {
      showModal({
        body: (
          <Button type='primary' onClick={onDisconnectClick} isFullWidth={true}>
            Disconnect
          </Button>
        ),
        withCloseButton: false,
        withCloseX: false
      });
    } else {
      showModal({
        type: 'connectModal',
        onConnect: onConnectClick
      });
    }
  }

  const [{ isConnected, accountAddress, networkStatus }] = useNetwork();
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
    <Button type='primary' onClick={onButtonClick} isProcessing={isConnecting}>
      {isConnected ? shortenedAccountAddress : 'Connect'}
    </Button>
  );
}
