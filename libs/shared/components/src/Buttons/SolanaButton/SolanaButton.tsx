import { NetworkButton } from '@usm/ui';
import { useModal } from '@usm-web/ui-module';
import { useNetwork, useConnect, useDisconnect, useAccountAddress } from '@usm-web/solana-module';

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
      hasWallet: !!networkStatus,
      onConnect() {
        connect();
        hideModal();
      }
    });
  }

  const [{ networkStatus }] = useNetwork();
  const [accountAddress] = useAccountAddress();
  const connect = useConnect();
  const disconnect = useDisconnect();

  return (
    <NetworkButton
      accountAddress={networkStatus === 'CONNECTED' ? accountAddress : undefined}
      isConnecting={networkStatus === 'CONNECTING'}
      onConnectClick={onConnectClick}
      onDisconnectClick={onDisconnectClick}
    >
      Connect
    </NetworkButton>
  );
}

export default SolanaButton;
