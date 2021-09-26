import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Selectors from '../../../redux/selectors/core';

export class ActiveBand extends React.Component {
  static propTypes = {
    activeBandName: PropTypes.string,
    canActiveArtistCreateTrackForBand: PropTypes.bool,
    createTrack: PropTypes.func
  };

  render() {
    return (
      <div>
        {this.props.activeBandName && <div>The active band:</div>}
        {this.props.activeBandName && (
          <div className='User__activeArtist'>
            Active Band: {this.props.activeBandName}{' '}
          </div>
        )}
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    activeBandName: Selectors.usm.getActiveBandName(state),
    canActiveArtistCreateTrackForBand:
      Selectors.usm.canActiveArtistCreateTrackForBand(state)
  };
}

export default connect(mapStateToProps)(ActiveBand);
