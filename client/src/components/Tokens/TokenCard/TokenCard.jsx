import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';

import PlaybackButton from '../../Buttons/PlaybackButton';
import CreateTrackButton from '../../Buttons/CreateTrackButton';
import JoinBandButton from '../../Buttons/JoinBandButton'
import InviteToBandButton from '../../Buttons/InviteToBandButton';
import * as Constants from '../../../constants';
import * as Selectors from '../../../redux/selectors';

import './TokenCard.scss';

export class TokenCard extends React.Component {
  static propTypes = {
    accountAddress: PropTypes.string,
    tokenId: PropTypes.number.isRequired,
    tokenType: PropTypes.string,
    canJoinBand: PropTypes.bool,
    canInviteToJoinBand: PropTypes.bool,
    name: PropTypes.string,
    description: PropTypes.string
  };

  renderButton() {
    switch (this.props.tokenType) {
      case Constants.usm.tokenType.ARTIST:
      case Constants.usm.tokenType.TRACK:                  
        return <PlaybackButton tokenId={this.props.tokenId} />
      case Constants.usm.tokenType.BAND:
        if (!this.props.accountAddress) {
          return;
        }
        if (this.props.canJoinBand) {
          return <JoinBandButton tokenId={this.props.tokenId} />  
        } else if (this.props.canInviteToJoinBand) {
          return <InviteToBandButton tokenId={this.props.tokenId} />
        }
        return <CreateTrackButton tokenId={this.props.tokenId} />
      default:
        return null;
    }    
  }

  render() {
    const tokenUrl = `/token/${this.props.tokenId}`;

    return (
      <Card className='TokenCard'>
        <Card.Header>
          <Nav className="mr-auto">
            {this.props.tokenType}
          </Nav>
        </Card.Header>
        {/* @TODO Render drop down menu with additional card options */}
        <Card.Body>
          <Card.Title>{this.props.name}<Link to={tokenUrl}> &gt;&gt;&gt;</Link></Card.Title>
          <Card.Text>{this.props.description}</Card.Text>
          {this.renderButton()}
        </Card.Body>
      </Card>
    );   
  }
}

export function mapStateToProps(state, { tokenId }) {
  const { tokenType, metadata } = Selectors.usm.selectTokenById(state, tokenId); 

  return {
    accountAddress: Selectors.web3.getAccountAddress(state),
    tokenType,
    tokenId,
    canJoinBand: Selectors.canJoinBand(state, tokenId),
    canInviteToJoinBand: Selectors.canInviteToJoinBand(state, tokenId),
    name: metadata?.name,
    description: metadata?.description
  }
}

export default connect(mapStateToProps)(TokenCard);
