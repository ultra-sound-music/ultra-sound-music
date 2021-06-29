import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Controls from './Controls';
import Canvas from './Canvas';
import PlaybackButton from './Buttons/PlaybackButton';

import * as Selectors from '../redux/selectors';

import './User.scss';

export class User extends React.Component {
  static propTypes = {
    accountAddress: PropTypes.string,
    hasMintedABand: PropTypes.bool,
    hasMintedAnArtist: PropTypes.bool,    
    activeArtistName: PropTypes.string,
    activeArtistId: PropTypes.number
  }

  render() {
    const {
      hasMintedABand,
      accountAddress
    } = this.props;

    let content;
    if (hasMintedABand) {
      content = 'Now Just Publish Some Tracks';
    } else {
      content = <Controls />;
    }

    return (
      <div className="User">
        <Row>
          <Col>
            <Canvas addresses={[accountAddress]} />
            {this.props.activeArtistName && <div className='User__activeArtist'>Active Artist: {this.props.activeArtistName} <PlaybackButton tokenId={this.props.activeArtistId} /> </div>}
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
    hasMintedAnArtist: Selectors.hasMintedAnArtist(state),
    activeArtistName: Selectors.usm.getActiveArtistName(state),
    activeArtistId: Selectors.usm.getActiveArtistId(state),
  };
}

export default connect(mapStateToProps)(User);
