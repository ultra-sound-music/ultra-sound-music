import { ReactNode } from 'react';

import Button, { IButtonProps } from '../../Button/Button';
import { getShortenedAccountAddress } from '@usm/util-string';

export interface INetworkButton {
  type?: IButtonProps['type'];
  accountAddress?: string;
  isConnecting?: boolean;
  onConnectClick(): void;
  onDisconnectClick(): void;
  children?: ReactNode;
}

export function NetworkButton({
  type = 'primary',
  accountAddress,
  isConnecting = false,
  onConnectClick,
  onDisconnectClick,
  children
}: INetworkButton) {
  function onButtonClick() {
    if (isConnected) {
      onDisconnectClick();
    } else {
      onConnectClick();
    }
  }

  const isConnected = !!accountAddress;
  const shortenedAccountAddress = getShortenedAccountAddress(accountAddress);

  return (
    <Button type={type} onClick={onButtonClick} isProcessing={isConnecting}>
      {isConnected ? shortenedAccountAddress : children || 'Connect'}
    </Button>
  );
}

export default NetworkButton;
