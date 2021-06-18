import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import PlaybackButton from '../../Buttons/PlaybackButton';
import CreateTrackButton from '../../Buttons/CreateTrackButton';
import * as Constants from '../../../constants';
import * as Selectors from '../../../redux/selectors';

import './TokenCard.scss';

export class TokenCard extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number.isRequired,
    tokenType: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  };

  renderButton() {
    switch (this.props.tokenType) {
      case Constants.usm.tokenType.ARTIST:
      case Constants.usm.tokenType.TRACK:                  
        return <PlaybackButton tokenId={this.props.tokenId} />
      case Constants.usm.tokenType.BAND:
        return <CreateTrackButton tokenId={this.props.tokenId} />
      default:
        return null;
    }    
  }

  render() {
    const tokenUrl = `/token/${this.props.tokenId}`;

    return (
      <Card className='TokenCard'>
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
    tokenType,
    tokenId,
    name: metadata?.name,
    description: metadata?.description
  }
}

export default connect(mapStateToProps)(TokenCard);
