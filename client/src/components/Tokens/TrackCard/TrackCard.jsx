import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TokenCard from '../TokenCard';

import * as Selectors from '../../../redux/selectors';

export class TrackCard extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
  };

  renderCtaButton() {
    return 'hi';
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
        tokenType='Track'
        name={name}
        description={description}
        ctaButton={this.renderCtaButton()}
      />
    );
  }
}

function mapStateToProps(state, { tokenId }) {
  const { name, description } = Selectors.usm.selectTokenById(state, tokenId); 
  if (!name) {
    return {};
  }

  return {
    name,
    description
  }
}

export default connect(mapStateToProps)(TrackCard);
