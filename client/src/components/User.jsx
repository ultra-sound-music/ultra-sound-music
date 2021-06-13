import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArtistControls from './ArtistControls';
import Controls from './Controls';
import Canvas from './Canvas';
import * as Selectors from '../redux/selectors';

import './User.scss';

export class User extends React.Component {
  static propTypes = {
    accountAddress: PropTypes.string,
    hasMintedABand: PropTypes.bool,
    hasMintedAnArtist: PropTypes.bool,    
  }

  render() {
    const {
      hasMintedABand,
      hasMintedAnArtist,
      accountAddress
    } = this.props;

    let content;
    if (hasMintedABand) {
      content = 'Now Just Publish Some Tracks';
    } else if (hasMintedAnArtist) {
      content = <ArtistControls />;
    } else if (accountAddress) {
      content = <Controls />;
    }

    const canvas = <Canvas addresses={[accountAddress]} />;

    return (
      <div className="User">
        <Row>
          <Col>
            {canvas}
            {content}
          </Col>
        </Row>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    accountAddress: Selectors.web3.getAccountAddress(state),
    hasMintedABand: Selectors.hasMintedABand(state),
    hasMintedAnArtist: Selectors.hasMintedAnArtist(state)
  };
}

export default connect(mapStateToProps)(User);
