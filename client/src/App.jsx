import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
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

import './App.scss';

export class App extends React.Component {
  state = {
    entities: [],
    isConnectedToNetwork: false,
    isConnectedToAccount: false,
    chainId: '',
    accountId: '',
    transactionHash: 'x' // Hack for redrawing upon successful transaction
  }

  updateTransactionHash = (tx) => {
    const hash = tx && tx.hash
    this.setState({
      transactionHash: hash
    });
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
                  <Nav.Link href="/myCollection">My Collection</Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                  <NetworkButton />
                  <Nav.Link>Profile</Nav.Link>
                </Nav>
              </Navbar>

              <Switch>
                <Route path="/about">
                  <Row>
                    <Col>
                      <About />
                    </Col>
                  </Row>
                </Route>

                <Route path="/tokens/:tokenId">
                  <Row>
                    <Col><Token /></Col>
                  </Row>
                </Route>                

                <Route path="/">
                  <Row>
                    <Col><User /></Col>
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

export default App;
