import React from 'react';
import { connect } from 'react-redux';
import truncate from 'lodash/truncate';

import copy from '@copy';
import { PillSwitch } from '@uiComponents';
import { IPillSwitchProps } from '@uiTypes';
import { IRootState } from '@store/types';
import web3 from '@store/web3';

export type TConnectButtonProps = IConnectButtonState & IConnectButtonActions;

export interface IConnectButtonState {
  networkStatus: string;
  address: string;
}

export interface IConnectButtonActions {
  connectWallet: () => void;
}

export class ConnectButton extends React.Component<TConnectButtonProps> {
  onClickConnect = (): void => {
    this.props.connectWallet();
  };

  getProps = (networkStatus: string): IPillSwitchProps => {
    switch (networkStatus) {
      case web3.constants.networkStatus.NOT_AVAILABLE:
      case web3.constants.networkStatus.NOT_CONNECTED:
        return {
          status: 'off',
          onClick: this.onClickConnect,
          children: `${copy.connect}`
        };
      case web3.constants.networkStatus.INSTALLING:
        return {
          status: 'pending',
          isDisabled: true,
          children: `${copy.installing}`
        };
      case web3.constants.networkStatus.CONNECTING:
        return {
          status: 'pending',
          isDisabled: true,
          children: `${copy.connecting}`
        };
      case web3.constants.networkStatus.CONNECTED: {
        const addr = truncate(this.props.address, { length: 9 });
        return {
          status: 'on',
          isDisabled: true,
          children: `${addr}`
        };
      }
      default:
        return {
          status: 'off',
          onClick: this.onClickConnect,
          children: `${copy.connect}`
        };
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
  connectWallet: web3.actions.connectWallet
};

export default connect(mapState, mapDispatch)(ConnectButton);
