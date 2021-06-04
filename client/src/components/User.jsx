import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MetaMaskButton from './MetaMaskButton';
import ArtistControls from './ArtistControls';
import Controls from './Controls';
import Canvas from './Canvas';
import * as entitiesUtils from '../utils/entities';

import './User.scss';

export class User extends React.Component {
  static propTypes = {
    updateTransactionHash: PropTypes.func,
    entities: PropTypes.array,
    isConnectedToNetwork: PropTypes.bool,
    isConnectedToAccount: PropTypes.bool,
    chainId: PropTypes.string,
    accountId: PropTypes.string
  }

  static defaultProps = {
    isConnectedToNetwork: false,
    isConnectedToAccount: false,
    chainId: '',
    accountId: ''
  }

  async componentDidMount() {

  }

  async componentWillUnmount() {
    // @Todo need to remove ethereum event handlers
  }

  render() {
    const {
      entities,
      accountId,
      chainId,
      isConnectedToAccount,
      isConnectedToNetwork,
      updateTransactionHash
    } = this.props;

    const hasAlreadyMintedAnArtist = entitiesUtils.hasAlreadyMintedAnArtist(entities, accountId);
    const hasAlreadyMintedABand = entitiesUtils.hasAlreadyMintedABand(entities, accountId);
    let content;
    if (hasAlreadyMintedABand) {
      content = 'Now Just Publish Some Tracks';
    } else if (hasAlreadyMintedAnArtist) {
      content = <ArtistControls accountId={accountId} entities={entities} />;
    } else if (isConnectedToAccount) {
      content = <Controls accountId={accountId} updateTransactionHash={updateTransactionHash} />;
    } else {
      content = <MetaMaskButton />;
    }

    let userInfo;
    if (isConnectedToNetwork) {
      userInfo = (
        <div>
          <p>{`Chain Id: ${chainId}`}</p>
          <p>{`Active wallet: ${accountId}`}</p>
        </div>
      );
    }

    const canvas = <Canvas addresses={[accountId]} />;

    return (
      <div className="User">
        <Row>
          <Col>
            {/* userInfo */}
            {canvas}
            {content}
          </Col>
        </Row>
      </div>
    );
  }
}

export default User;
