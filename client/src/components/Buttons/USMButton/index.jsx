import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Selectors from '../../../redux/selectors';
import * as Constants from '../../../constants';
import Button from '../Button';
import CreateArtistButton from '../CreateArtistButton';
import CreateTrackButton from '../CreateTrackButton';
import JoinBandButton from '../JoinBandButton';

export class NetworkButton extends React.Component {
  static propTypes = {
    networkStatus: PropTypes.string
  }

  render() {
    switch (this.props.networkStatus) {
      case Constants.networkStatus.NOT_INSTALLED:
        return <Button>Connected</Button>
      default:
        return <Button>do stuff</Button>
    }
  }
}

function mapStateToProps(state) {
  return {
    networkStatus: Selectors.web3.getNetworkStatus(state)
  };
}

export default connect(mapStateToProps)(NetworkButton);