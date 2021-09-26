import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TokenCard from '../TokenCard';
import PlaybackButton from '../../Buttons/PlaybackButton';

import * as Selectors from '../../../redux/selectors/core';

export class TrackCard extends React.Component {
  static propTypes = {
    entityId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  };

  renderCtaButton() {
    return <PlaybackButton entityId={this.props.entityId} />;
  }

  render() {
    const { entityId, name, description } = this.props;

    return (
      <TokenCard
        entityId={entityId}
        tokenType='Track'
        name={name}
        description={description}
        ctaButton={this.renderCtaButton()}
      />
    );
  }
}

function mapStateToProps(state, { entityId }) {
  const { name, description } = Selectors.usm.selectTokenById(state, entityId);
  if (!name) {
    return {};
  }

  return {
    name,
    description
  };
}

export default connect(mapStateToProps)(TrackCard);
