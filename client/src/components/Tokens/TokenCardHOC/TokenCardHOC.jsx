import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ArtistCard from '../ArtistCard';
import BandCard from '../BandCard';
import TrackCard from '../TrackCard';

import * as Constants from '../../../constants';
import * as Selectors from '../../../redux/selectors';

import './TokenCardHOC.scss';

export class TokenCardHOC extends React.Component {
  static propTypes = {
    entityId: PropTypes.string,
    tokenType: PropTypes.string,
  };

  render() {
    const {
      tokenType,
      entityId
    } = this.props;

    const props = {
      entityId
    };

    switch (tokenType) {
      case Constants.usm.tokenType.ARTIST:
        return <ArtistCard {...props} />
      case Constants.usm.tokenType.BAND:
        return <BandCard {...props} />
      case Constants.usm.tokenType.TRACK:                  
        return <TrackCard {...props} />
      default:
        return null;      
    }
  }
}

export function mapStateToProps(state, { entityId }) {
  const { tokenType } = Selectors.usm.selectTokenById(state, entityId); 

  return {
    tokenType
  }
}

export default connect(mapStateToProps)(TokenCardHOC);
