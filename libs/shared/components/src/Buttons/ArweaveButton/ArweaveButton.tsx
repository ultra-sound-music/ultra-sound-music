import { NetworkButton } from '@usm/ui';
import { useNetworkStatus, useAccountAddress, useConnect, useDisconnect } from '@usm-web/arweave-module';

export function ArweaveButton() {
  function onDisconnectClick() {
    disconnect();
  }

  function onConnectClick() {
    connect();
  }

  const [accountAddress] = useAccountAddress();
  const [networkStatus] = useNetworkStatus();
  const connect = useConnect();
  const disconnect = useDisconnect();

  return (
    <NetworkButton
      type='secondary'
      accountAddress={networkStatus === 'CONNECTED' ? accountAddress : undefined}
      isConnecting={networkStatus === 'CONNECTING'}
      onConnectClick={onConnectClick}
      onDisconnectClick={onDisconnectClick}
    >
      Connect to Arweave
    </NetworkButton>
  );
}

export default ArweaveButton;
