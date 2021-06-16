import React  from 'react';
import PropTypes from 'prop-types';
import * as Constants from '../../../constants';
import PlaybackButton from '../PlaybackButton';
import CreateTrackButton from '../CreateTrackButton';

export class TokenButton extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number,
    tokenType: PropTypes.string
  }

  render() {
    switch (this.props.tokenType) {
      case Constants.usm.tokenType.ARTIST:
      case Constants.usm.tokenType.TRACK:                  
        return <PlaybackButton tokenId={this.props.tokenId} />
      case Constants.usm.tokenType.BAND:
        return <CreateTrackButton tokenId={this.props.tokenId} />
      default:
        return null;
    }
  }
}

export default TokenButton;