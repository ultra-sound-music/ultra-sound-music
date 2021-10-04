import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ArtistCard from '../ArtistCard';
import BandCard from '../BandCard';
import TrackCard from '../TrackCard';

import constants from '@constants';
import * as Selectors from '../../../redux/core/selectors';

import './TokenCardHOC.scss';

export class TokenCardHOC extends React.Component {
  static propTypes = {
    entityId: PropTypes.string,
    tokenType: PropTypes.string
  };

  render() {
    const { tokenType, entityId } = this.props;

    const props = {
      entityId
    };

    switch (tokenType) {
      case constants.usm.tokenType.ARTIST:
        return <ArtistCard {...props} />;
      case constants.usm.tokenType.BAND:
        return <BandCard {...props} />;
      case constants.usm.tokenType.TRACK:
        return <TrackCard {...props} />;
      default:
        return null;
    }
  }
}

export function mapStateToProps(state, { entityId }) {
  const { tokenType } = Selectors.usm.selectTokenById(state, entityId);

  return {
    tokenType
  };
}

export default connect(mapStateToProps)(TokenCardHOC);
