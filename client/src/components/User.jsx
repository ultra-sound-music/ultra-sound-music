import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ActiveArtist from './Tokens/ActiveArtist'
import ActiveBand from './Tokens/ActiveBand'

import './User.scss';

export class User extends React.Component {
  render() {
    return (
      <div className="User">
        <Row>
          <Col>
            <ActiveArtist />
          </Col>
          <Col>
            <ActiveBand />
          </Col>          
        </Row>
      </div>
    );
  }
}

export default User;
