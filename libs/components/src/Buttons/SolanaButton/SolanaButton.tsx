import { useEffect } from 'react';

import { NetworkButton } from '@usm/ui';
import { useNetwork, useConnect, useDisconnect, useModal, web3Constants } from '@usm/app-state';

export function SolanaButton() {
  const { showModal, hideModal } = useModal();

  function onDisconnectClick() {
    showModal({
      type: 'disconnectModal',
      onDisconnect() {
        disconnect();
        hideModal();
      }
    });
  }

  function onConnectClick() {
    showModal({
      type: 'connectModal',
      onConnect() {
        connect();
        hideModal();
      }
    });
  }

  const [{ isConnected, accountAddress, networkStatus }] = useNetwork();
  const connect = useConnect();
  const disconnect = useDisconnect();

  const isConnecting = networkStatus === web3Constants.networkStatus.CONNECTING;

  useEffect(() => {
    if (!isConnected && accountAddress) {
      connect();
    }
  }, []);

  return (
    <NetworkButton
      accountAddress={accountAddress}
      isConnecting={isConnecting}
      onConnectClick={onConnectClick}
      onDisconnectClick={onDisconnectClick}
    >
      Connect
    </NetworkButton>
  );
}

export default SolanaButton;
