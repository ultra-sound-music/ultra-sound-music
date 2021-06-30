import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import truncate from 'lodash/truncate';
import Button from '../Button';
import * as Selectors from '../../../redux/selectors';
import * as Actions from  '../../../redux/actions';
import * as Constants from '../../../constants';

export class NetworkButton extends React.Component {
  static propTypes = {
    networkStatus: PropTypes.string,
    address: PropTypes.string,
    connectWallet: PropTypes.func
  }

  onConnectClick = () => {
    this.props.connectWallet();
  }  

  render() {
    switch (this.props.networkStatus) {
      case Constants.web3.networkStatus.NOT_AVAILABLE:
      case Constants.web3.networkStatus.NOT_CONNECTED:
        return <Button onClick={this.onConnectClick}>Connect</Button>;
      case Constants.web3.networkStatus.INSTALLING:
        return <Button disabled>Installing...</Button>
      case Constants.web3.networkStatus.CONNECTING:
        return <Button disabled>Connecting...</Button>        
      case Constants.web3.networkStatus.CONNECTED: {
        let addr = truncate(this.props.address, {length: 9});
        return <Button disabled>Connected to {addr}</Button>
      }
      default:
        return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    networkStatus: Selectors.web3.getNetworkStatus(state),
    address: Selectors.web3.getAccountAddress(state)
  };
}

export const mapDispatchToProps = {
  connectWallet: Actions.web3.connectWallet  
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkButton);