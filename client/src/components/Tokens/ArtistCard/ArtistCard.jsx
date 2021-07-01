import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TokenCard from '../TokenCard';
import PlaybackButton from '../../Buttons/PlaybackButton';

import * as Selectors from '../../../redux/selectors';

export class ArtistCard extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
  };

  render() {
    const {
      tokenId,
      name,
      description
    } = this.props;

    return (
      <TokenCard
        tokenId={tokenId}      
        tokenType='Artist'
        name={name}
        description={description}
        ctaButton={<PlaybackButton tokenId={tokenId} />}
      />
    );
  }
}

function mapStateToProps(state, { tokenId }) {
  const { metadata } = Selectors.usm.selectTokenById(state, tokenId); 
  if (!metadata) {
    return {};
  }

  return {
    name: metadata.name,
    description: metadata.description
  }
}

export default connect(mapStateToProps)(ArtistCard);
