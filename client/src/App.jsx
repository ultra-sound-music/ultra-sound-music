import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import About from './components/About';
import User from './components/User';
import Alert from './components/Alert';
import Token from './components/Tokens/Token';
import Searchable from './components/Searchable';
import NetworkButton from './components/Buttons/NetworkButton'
import Onboarding from './components/Onboarding';
import ProcessingIndicator from './components/ProcessingIndicator';

import * as Selectors from './redux/selectors';

import './App.scss';

export class App extends React.Component {
  static propTypes = {
    accountAddress: PropTypes.string,
    hasOpenTransactions: PropTypes.bool
  }

  renderProcessingIndicator() {
    if (this.props.hasOpenTransactions) {
      return (
        <div className='App__banner'>
          <ProcessingIndicator />          
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <Router>
          <div className="App">
            <Container>
              <Navbar bg="light">
                <Navbar.Brand href="/">🦇 🔉 🎼 Ultra Sound Music Project</Navbar.Brand>
                <Nav>
                  <Nav.Link href="/about">About</Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                  <NetworkButton />
                  <Nav.Link>Profile</Nav.Link>
                </Nav>
              </Navbar>

              {this.renderProcessingIndicator()}

              <Switch>
                <Route path="/about" component={About} />
                <Route path="/token/:tokenId">
                  <Row>
                    <Col><Token /></Col>
                  </Row>
                </Route>                

                <Route path="/">
                  <Row>
                    <Col>{this.props.accountAddress ? <User /> : <Onboarding />}</Col>
                  </Row>
                  <Row>
                    <Col><Searchable /></Col>
                  </Row>
                </Route>
              </Switch>             
            </Container>
          </div>
        </Router>
        <Alert />
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    hasOpenTransactions: Selectors.usm.hasOpenTransactions(state),
    accountAddress: Selectors.web3.getAccountAddress(state)
  }
}

export default connect(mapStateToProps)(App);
