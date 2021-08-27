import React  from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import classNames from 'classnames';

import './TokenCard.scss';

export class TokenCard extends React.Component {
  static propTypes = {
    entityId: PropTypes.string.isRequired,
    tokenType: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    ctaButton: PropTypes.node,
    actionIcons: PropTypes.array
  };

  render() {
    const {
      entityId,
      tokenType,
      name,
      description,
      ctaButton
    } = this.props;

    const tokenUrl = `/token/${entityId}`;

    const className = classNames('TokenCard', {
      [`TokenCard-${tokenType}`]: true
    })

    return (
      <Card className={className}>
        <Card.Header className="TokenCard__header">
          <Nav className="TokenCard__title">
            {tokenType}
          </Nav>
          <Nav className="TokenCard__actionIcons">
            {this.props.actionIcons && this.props.actionIcons.map((icon, i) => <div key={i} className='TokenCard__actionIcon'>{icon}</div>)}
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
