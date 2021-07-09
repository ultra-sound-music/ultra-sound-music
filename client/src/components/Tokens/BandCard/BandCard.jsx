import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TokenCard from '../TokenCard';
import CreateTrackButton from '../../Buttons/CreateTrackButton';
import RequestToJoinBandButton from '../../Buttons/RequestToJoinBandButton';
import JoinBandButton from '../../Buttons/JoinBandButton';
import BandMemberIcon from '../../Icons/BandMemberIcon';
import * as Constants from '../../../constants';
import * as Selectors from '../../../redux/selectors';

export class BandCard extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    canCreateTrack: PropTypes.bool,
    canRequestToJoinBand: PropTypes.bool,
    canJoinBand: PropTypes.bool,
    bandMembers: PropTypes.arrayOf(PropTypes.number)
  };

  renderBandMemberIcons() {
    const { bandMembers } = this.props;
    const emptyArray = Array.from(new Array(Constants.usm.MAX_BAND_MEMBERS));
    return emptyArray.map((n, i) => {
      const id = bandMembers[i];
      return <BandMemberIcon key={id} artistId={id} />
    })
  }  

  renderCtaButton() {
    const {
      tokenId,
      canCreateTrack,
      canRequestToJoinBand,
      canJoinBand
    } = this.props;

    if (canCreateTrack) {
      return <CreateTrackButton />;
    }

    if (canJoinBand) {
      return <JoinBandButton bandId={tokenId} />;
    }

    if (canRequestToJoinBand) {
      return <RequestToJoinBandButton />;
    }
  }

  render() {
    const {
      tokenId,
      name,
      description,
    } = this.props;

    return (
      <TokenCard
        tokenId={tokenId}
        tokenType='Band'
        name={name}
        description={description}
        actionIcons={this.renderBandMemberIcons()}
        ctaButton={this.renderCtaButton()}
      />
    );
  }
}

function mapStateToProps(state, { tokenId }) {
  const { name, description } = Selectors.usm.selectTokenById(state, tokenId); 
  const canCreateTrack = Selectors.canCreateTrack(state, tokenId);
  const canRequestToJoinBand = Selectors.canRequestToJoinBand(state, tokenId);
  const canJoinBand = Selectors.canJoinBand(state, tokenId);
  const bandMembers = Selectors.usm.getBandMembers(state, tokenId);

  return {
    name,
    description,
    canCreateTrack,
    canRequestToJoinBand,
    canJoinBand,
    bandMembers
  }
}

export default connect(mapStateToProps)(BandCard);
