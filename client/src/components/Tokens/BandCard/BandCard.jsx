import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TokenCard from '../TokenCard';
import CreateTrackButton from '../../Buttons/CreateTrackButton';
import RequestToJoinBandButton from '../../Buttons/RequestToJoinBandButton';
import JoinBandButton from '../../Buttons/JoinBandButton';
import BandMemberIcon from '../../Icons/BandMemberIcon';
import constants from '@constants';
import * as Selectors from '../../../redux/core/selectors';

export class BandCard extends React.Component {
  static propTypes = {
    entityId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    canCreateTrack: PropTypes.bool,
    canRequestToJoinBand: PropTypes.bool,
    canJoinBand: PropTypes.bool,
    bandMemberIds: PropTypes.arrayOf(PropTypes.string)
  };

  renderBandMemberIcons() {
    const { bandMemberIds } = this.props;
    const emptyArray = Array.from(new Array(constants.usm.MAX_BAND_MEMBERS));
    return emptyArray.map((n, i) => {
      const artistId = bandMemberIds[i];
      return <BandMemberIcon key={artistId} artistId={artistId} />;
    });
  }

  renderCtaButton() {
    const { entityId, canCreateTrack, canRequestToJoinBand, canJoinBand } =
      this.props;

    if (canCreateTrack) {
      return <CreateTrackButton bandId={entityId} />;
    }

    if (canJoinBand) {
      return <JoinBandButton entityId={entityId} />;
    }

    if (canRequestToJoinBand) {
      return <RequestToJoinBandButton />;
    }
  }

  render() {
    const { entityId, name, description } = this.props;

    return (
      <TokenCard
        entityId={entityId}
        tokenType='Band'
        name={name}
        description={description}
        actionIcons={this.renderBandMemberIcons()}
        ctaButton={this.renderCtaButton()}
      />
    );
  }
}

function mapStateToProps(state, { entityId }) {
  const { name, description } = Selectors.usm.selectTokenById(state, entityId);
  const canCreateTrack = Selectors.usm.canCreateTrackForBand(state, entityId);
  const canRequestToJoinBand = Selectors.usm.canRequestToJoinBand(
    state,
    entityId
  );
  const canJoinBand = Selectors.usm.canJoinBand(state, entityId);
  const bandMemberIds = Selectors.usm.getBandMemberIds(state, entityId);

  return {
    name,
    description,
    canCreateTrack,
    canRequestToJoinBand,
    canJoinBand,
    bandMemberIds
  };
}

export default connect(mapStateToProps)(BandCard);
