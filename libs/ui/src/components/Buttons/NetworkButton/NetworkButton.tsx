import { ReactNode } from 'react';

import { getShortenedAccountAddress } from '@usm/util-string';

import Button, { IButtonProps } from '../../Button/Button';

export interface INetworkButtonProps {
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
}: INetworkButtonProps) {
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
