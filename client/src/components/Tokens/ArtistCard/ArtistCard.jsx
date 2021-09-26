import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TokenCard from '../TokenCard';
import PlaybackButton from '../../Buttons/PlaybackButton';

import * as Selectors from '../../../redux/selectors/core';

export class ArtistCard extends React.Component {
  static propTypes = {
    entityId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  };

  render() {
    const { entityId, name, description } = this.props;

    return (
      <TokenCard
        entityId={entityId}
        tokenType='Artist'
        name={name}
        description={description}
        ctaButton={<PlaybackButton entityId={entityId} />}
      />
    );
  }
}

function mapStateToProps(state, { entityId }) {
  const { name, description } = Selectors.usm.selectTokenById(state, entityId);

  return {
    name,
    description
  };
}

export default connect(mapStateToProps)(ArtistCard);
