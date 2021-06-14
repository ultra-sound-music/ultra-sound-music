import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

import * as Selectors from '../../../redux/selectors';
import TokenButton from '../../Buttons/TokenButton';

export class TokenCard extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number.isRequired,
    tokenType: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  };

  render() {
    const {
      tokenId,
      tokenType
    } = this.props;

    return (
      <Card className='TokenCard'>
        {/* @TODO Render drop down menu with additional card options */}
        <Card.Body>
          <Card.Title>{this.props.name}</Card.Title>
          <Card.Text>{this.props.description}</Card.Text>
          <TokenButton tokenId={tokenId} tokenType={tokenType} />
        </Card.Body>
      </Card>  
    );   
  }
}

export function mapStateToProps(state, { tokenId }) {
  const { tokenType, metadata } = Selectors.tokens.selectTokenById(state, tokenId); 

  return {
    tokenType,
    name: metadata?.name,
    description: metadata?.description
  }
}

export default connect(mapStateToProps)(TokenCard);
