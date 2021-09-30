import React from 'react';
import { connect } from 'react-redux';
import truncate from 'lodash/truncate';
import copy from '@copy';
import { PillSwitch } from '@uiComponents';

import { IRootState } from '@store/types';
import ui from '@store/ui';
import web3 from '@store/web3';

import { IPillSwitchProps } from '@uiTypes';
import constants from '@constants';

export type TConnectButtonProps = IConnectButtonState & IConnectButtonActions;

export interface IConnectButtonState {
  networkStatus: string;
  address: string;
}

export interface IConnectButtonActions {
  showInstallWalletModal: () => void;
  connectWallet: () => void;
}

export class ConnectButton extends React.Component<TConnectButtonProps> {
  onClickConnect = (): void => {
    this.props.connectWallet();
  };

  onClickInstall = (): void => {
    this.props.showInstallWalletModal();
  };

  getProps = (networkStatus: string): IPillSwitchProps => {
    switch (networkStatus) {
      case constants.web3.networkStatus.NOT_AVAILABLE:
        return {
          status: 'off',
          onClick: this.onClickInstall,
          children: `${copy.connect}`
        };
      case constants.web3.networkStatus.NOT_CONNECTED:
        return {
          status: 'off',
          onClick: this.onClickConnect,
          children: `${copy.connect}`
        };
      case constants.web3.networkStatus.INSTALLING:
        return {
          status: 'pending',
          isDisabled: true,
          children: `${copy.installing}`
        };
      case constants.web3.networkStatus.CONNECTING:
        return {
          status: 'pending',
          isDisabled: true,
          children: `${copy.connecting}`
        };
      case constants.web3.networkStatus.CONNECTED: {
        const addr = truncate(this.props.address, { length: 9 });
        return {
          status: 'on',
          isDisabled: true,
          children: `${addr}`
        };
      }
      default:
        return null;
    }
  };

  render(): JSX.Element {
    const { children, ...props } = this.getProps(this.props.networkStatus);
    return <PillSwitch {...props}>{children}</PillSwitch>;
  }
}

export function mapState(state: IRootState): IConnectButtonState {
  return {
    networkStatus: web3.selectors.getNetworkStatus(state),
    address: web3.selectors.getAccountAddress(state)
  };
}

export const mapDispatch: IConnectButtonActions = {
  showInstallWalletModal: ui.actions.showInstallWalletModal,
  connectWallet: web3.actions.connectWallet
};

export default connect(mapState, mapDispatch)(ConnectButton);
