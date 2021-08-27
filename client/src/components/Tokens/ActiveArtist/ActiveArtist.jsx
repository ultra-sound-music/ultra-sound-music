import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Controls from '../../Controls';
import Canvas from '../../Canvas';
import PlaybackButton from '../../Buttons/PlaybackButton';

import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';

export class ActiveArtist extends React.Component {
  static propTypes = {
    canActiveArtistCreateTrackForBand: PropTypes.bool,
    createTrack: PropTypes.func,
    activeArtistName: PropTypes.string,
    activeArtistId: PropTypes.string,
    hasMintedABand: PropTypes.bool,
    accountAddress: PropTypes.string  
  }

  onClick() {
    if (this.props.canActiveArtistCreateTrackForBand) {
      this.props.createTrack();
    } else {
      // Show information modal
    }
  }

  isDisabled() {
    return !(this.props.canActiveArtistCreateTrackForBand);
  }

  render() {
    const {
      hasMintedABand,
      accountAddress
    } = this.props;

    let content;
    if (hasMintedABand) {
      content = 'Now Just Publish Some Tracks';
    } else {
      content = <Controls />;
    }

    return (
      <div className='ActiveArtist'>
        <Canvas addresses={[accountAddress]} />
        {this.props.activeArtistName && <div className='User__activeArtist'>Active Artist: {this.props.activeArtistName} <PlaybackButton entityId={this.props.activeArtistId} /> </div>}
        {content}
      </div>      
    )
  }
}

export function mapStateToProps(state) {
  return {
    activeArtistName: Selectors.usm.getActiveArtistName(state),
    activeArtistId: Selectors.usm.getActiveArtistId(state),
    hasMintedABand: Selectors.hasMintedABand(state),
    accountAddress: Selectors.web3.getAccountAddress(state),
  };
}

export const mapDispatchToProps = {
  createTrack: Actions.usm.createTrack,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveArtist);