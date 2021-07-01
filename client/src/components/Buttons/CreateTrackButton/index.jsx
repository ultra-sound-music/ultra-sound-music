import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';

export class CreateTrackButton extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number,
    isOwned: PropTypes.bool,
    numBandMembers: PropTypes.number,
    play: PropTypes.func,
    stop: PropTypes.func
  }

  onClick() {
    const bandIsOwned = false;
    const hasPublishedTrack = false;
    if (bandIsOwned && !hasPublishedTrack) {
      // Create Track
    } else {
      // Show information modal
    }
  }

  isDisabled() {
    return !(this.props.isOwned || this.props.numBandMembers >= 4);
  }

  render() {
    return <Button onClick={this.onClick} disabled={this.isDisabled()}>Create Track</Button>
  }
}

export function mapStateToProps(state, { tokenId }) {
  const ownedTokens = Selectors.getOwnedTokens(state);
  const isOwned = ownedTokens.some((ownedTokenId) => ownedTokenId === tokenId)

  const bandsWithPublishedTracks = Selectors.getBandsWithPublishedTracks(state);
  const hasPublishedTrack = bandsWithPublishedTracks.some((bandId) => bandId === tokenId);
  const numBandMembers = Selectors.usm.getNumBandMembers(state);

  return {
    isOwned,
    numBandMembers,
    hasPublishedTrack
  };
}

export const mapDispatchToProps = {
  play: Actions.playback.play,
  stop: Actions.playback.stop
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTrackButton);