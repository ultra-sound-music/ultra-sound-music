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
    tokenId: PropTypes.number,
    tokenType: PropTypes.string,
  };

  render() {
    const {
      tokenType,
      tokenId
    } = this.props;

    switch (tokenType) {
      case Constants.usm.tokenType.ARTIST:
        return <ArtistCard tokenId={tokenId} />
      case Constants.usm.tokenType.BAND:
        return <BandCard tokenId={tokenId} />
      case Constants.usm.tokenType.TRACK:                  
        return <TrackCard tokenId={tokenId} />
      default:
        return null;      
    }
  }
}

export function mapStateToProps(state, { tokenId }) {
  const { tokenType } = Selectors.usm.selectTokenById(state, tokenId); 

  return {
    tokenType
  }
}

export default connect(mapStateToProps)(TokenCardHOC);
