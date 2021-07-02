import React  from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import classNames from 'classnames';

import './TokenCard.scss';

export class TokenCard extends React.Component {
  static propTypes = {
    tokenId: PropTypes.number.isRequired,
    tokenType: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    ctaButton: PropTypes.node
  };

  render() {
    const {
      tokenId,
      tokenType,
      name,
      description,
      ctaButton
    } = this.props;

    const tokenUrl = `/token/${tokenId}`;

    const className = classNames('TokenCard', {
      [`TokenCard-${tokenType}`]: true
    })

    return (
      <Card className={className}>
        <Card.Header>
          <Nav className="mr-auto">
            {tokenType}
          </Nav>
        </Card.Header>
        <Card.Body>
          <Card.Title>{name}<Link to={tokenUrl}> &gt;&gt;&gt;</Link></Card.Title>
          <Card.Text>{description}</Card.Text>
          {ctaButton}
        </Card.Body>
      </Card>
    );   
  }
}

export default TokenCard;
