import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Selectors from '../../../redux/selectors';
import * as Constants from '../../../constants';
import Button from '../Button';
import ConnectButton from '../ConnectButton';

export class NetworkButton extends React.Component {
  static propTypes = {
    networkStatus: PropTypes.string
  }

  render() {
    switch (this.props.networkStatus) {
      case Constants.web3.networkStatus.NOT_INSTALLED:
      case Constants.web3.networkStatus.NOT_CONNECTED:
        return <ConnectButton />;
      case Constants.web3.networkStatus.INSTALLING:
        return <Button disabled>Installing...</Button>
      case Constants.web3.networkStatus.CONNECTING:
        return <Button disabled>Connecting...</Button>        
      case Constants.web3.networkStatus.CONNECTED:
        return <Button disabled>Connected</Button>
      default:
        return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    networkStatus: Selectors.web3.getNetworkStatus(state)
  };
}

export default connect(mapStateToProps)(NetworkButton);