import React from 'react';
import {
  HashRouter as Router,
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
import Searchable from './components/Searchable';
import * as api from './api';
import * as metaMask from './utils/metaMask';

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

  async componentDidMount() {
    const chainId = await metaMask.getChainId();
    const accountId = await metaMask.getAccountId();
    const isConnectedToAccount = await metaMask.isConnectedToAccount();
    const isConnectedToNetwork = metaMask.isConnectedToNetwork();

    this.setState({
      isConnectedToNetwork,
      isConnectedToAccount,
      chainId,
      accountId
    });    

    api.getAllEntities().then(({data}) => {
      this.setState({
        entities: data
      });
    });

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        this.setState({
          isConnectedToNetwork: !!chainId,
          chainId
        });
      });
  
      window.ethereum.on('accountsChanged', (accounts) => {
        const accountId = accounts[0];
        this.setState({
          isConnectedToAccount: !!accountId,
          accountId
        });
      });   
    } 
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.transactionHash && (prevState.transactionHash !== this.state.transactionHash)) {
      api.getAllEntities().then(({data}) => {
        this.setState({
          entities: data
        });
      });
    }
  }

  updateTransactionHash = (tx) => {
    const hash = tx && tx.hash
    this.setState({
      transactionHash: hash
    });
  }

  render() {
    const {
      entities,
      isConnectedToNetwork,
      isConnectedToAccount,
      chainId,
      accountId
    } = this.state; 

    const userProps = {
      updateTransactionHash: this.updateTransactionHash,
      entities,
      isConnectedToNetwork,
      isConnectedToAccount,
      chainId,
      accountId
    }

    return (
      <div>
        <Router>
          <div className="App">
            <Container>
              <Navbar bg="light" expand="lg">
                <Navbar.Brand><Link to="/">🦇 🔉 🎼 Ultra Sound Music Project</Link></Navbar.Brand>
                <Nav className="mr-auto">
                  <Nav.Link href="/about">About</Nav.Link>
                  <Nav.Link href="/myCollection">My Collection</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link eventKey={2} href="">
                    Profile
                  </Nav.Link>
                </Nav>
              </Navbar>

              <Row>
                <Col>
                  <Switch>
                    <Route path="/about">
                      <About />
                    </Route>
                    <Route path="/">
                      <User {...userProps} />
                      {/* <CollectionNav /> @todo - also get rid of the component */}
                      <Switch>
                        <Route path="/myCollection">
                          <Searchable entities={this.state.entities} currentAccountId={this.state.accountId} onlyOwned={true} updateTransactionHash={this.updateTransactionHash}/>
                        </Route>
                        <Route path="/">
                          <Searchable entities={this.state.entities} currentAccountId={this.state.accountId} updateTransactionHash={this.updateTransactionHash} />
                        </Route>
                      </Switch>
                    </Route>
                  </Switch>
                </Col>
              </Row>
            </Container>
          </div>
        </Router>
        <Alert />
      </div>
    );
  }
}

export default App;
