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
      case Constants.entities.tokenType.ARTIST:
      case Constants.entities.tokenType.TRACK:                  
        return <PlaybackButton tokenId={this.props.tokenId} />
      case Constants.entities.tokenType.BAND:
        return <CreateTrackButton tokenId={this.props.tokenId} />
      default:
        return null;
    }
  }
}

export default TokenButton;