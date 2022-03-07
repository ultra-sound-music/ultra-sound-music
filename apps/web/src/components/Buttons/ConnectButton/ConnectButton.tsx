import { Button } from '@usm/ui';
import {
  useIsConnected,
  useGetShortenedAccountAddress,
  useConnect,
  useDisconnect
} from '@usm/app-state';

export default function ConnectButton() {
  const connect = useConnect();
  const disconnect = useDisconnect();
  const isConnected = useIsConnected();
  const shortenedAccountAddress = useGetShortenedAccountAddress();

  function onClick() {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }

  return (
    <Button type='primary' onClick={onClick}>
      {isConnected ? shortenedAccountAddress : 'Connect'}
    </Button>
  );
}
