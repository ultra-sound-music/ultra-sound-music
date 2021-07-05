import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TokenCard from '../TokenCard';
import CreateTrackButton from '../../Buttons/CreateTrackButton';
import RequestToJoinBandButton from '../../Buttons/RequestToJoinBandButton';
import JoinBandButton from '../../Buttons/JoinBandButton';

import * as Selectors from '../../../redux/selectors';

export class BandCard extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    canCreateTrack: PropTypes.bool,
    canRequestToJoinBand: PropTypes.bool,
    canJoinBand: PropTypes.bool
  };

  renderCtaButton() {
    const {
      tokenId,
      canCreateTrack,
      canRequestToJoinBand,
      canJoinBand
    } = this.props;

    if (canCreateTrack) {
      return <CreateTrackButton />
    }

    if (canJoinBand) {
      return <JoinBandButton bandId={tokenId} />
    }

    if (canRequestToJoinBand) {
      return <RequestToJoinBandButton />
    }
  }

  render() {
    const {
      tokenId,
      name,
      description
    } = this.props;

    return (
      <TokenCard
        tokenId={tokenId}
        tokenType='Band'
        name={name}
        description={description}
        ctaButton={this.renderCtaButton()}
      />
    );
  }
}

function mapStateToProps(state, { tokenId }) {
  const { name, description } = Selectors.usm.selectTokenById(state, tokenId); 
  const canCreateTrack = Selectors.isOwnedToken(state, tokenId);
  const canRequestToJoinBand = Selectors.canRequestToJoinBand(state, tokenId);
  const canJoinBand = Selectors.canJoinBand(state, tokenId);

  return {
    name,
    description,
    canCreateTrack,
    canRequestToJoinBand,
    canJoinBand
  }
}

export default connect(mapStateToProps)(BandCard);
