import React from 'react';
import { connect } from 'react-redux';
import truncate from 'lodash/truncate';
import copy from '../../../copy';
import { PillSwitch } from '@components';

import { IRootState } from '@store/types';
import web3 from '@store/web3';

import { IPillSwitchProps } from '@uiTypes';
import {
  TConnectButtonProps,
  IConnectButtonActions,
  IConnectButtonState
} from './ConnectButton.types';
import * as Constants from '../../../constants';

export class ConnectButton extends React.Component<TConnectButtonProps> {
  getProps = (networkStatus: string): IPillSwitchProps => {
    switch (networkStatus) {
      case Constants.web3.networkStatus.NOT_AVAILABLE:
      case Constants.web3.networkStatus.NOT_CONNECTED:
        return {
          status: 'off',
          onClick: this.onClickConnect,
          children: `${copy.connect}`
        };
      case Constants.web3.networkStatus.INSTALLING:
        return {
          status: 'pending',
          isDisabled: true,
          children: `${copy.installing}`
        };
      case Constants.web3.networkStatus.CONNECTING:
        return {
          status: 'pending',
          isDisabled: true,
          children: `${copy.connecting}`
        };
      case Constants.web3.networkStatus.CONNECTED: {
        const addr = truncate(this.props.address, { length: 9 });
        return {
          status: 'on',
          isDisabled: true,
          children: `${copy.connectedTo} ${addr}`
        };
      }
      default:
        return null;
    }
  };

  onClickConnect = (): void => {
    this.props.connectWallet();
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
  connectWallet: web3.actions.connectWallet
};

export default connect(mapState, mapDispatch)(ConnectButton);
