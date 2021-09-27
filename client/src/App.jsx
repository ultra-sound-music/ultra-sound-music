import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { FullLayout } from '@layouts';
import { SiteFooter, Overlay } from '@uiComponents';
import usm from '@store/usm';
import ui from '@store/ui';
import web3 from '@store/web3';

// import About from './components/About';
// import User from './components/User';
import SiteHeader from '@appComponents/SiteHeader/SiteHeader';
import Modal from '@appComponents/Modal/Modal';
import Landing from './pages/Landing';
import BandsPage from './pages/BandsPage';
// import Token from './components/Tokens/Token';
// import Searchable from './components/Searchable';

import styles from './App.scss';

export class App extends React.Component {
  static propTypes = {
    accountAddress: PropTypes.string,
    isProcessingTransaction: PropTypes.bool,
    modalType: PropTypes.string,
    modalProps: PropTypes.object
  };

  renderProcessingIndicator() {
    if (this.props.isProcessingTransaction) {
      return <Overlay />;
    }
  }

  render() {
    const { modalType, modalProps } = this.props;

    return (
      <div>
        <Router>
          <div className='App'>
            <FullLayout>
              <div className={styles.site_header}>
                <SiteHeader />
              </div>
            </FullLayout>

            <Switch>
              <Route path='/bands'>
                <BandsPage />
              </Route>

              <Route path='/tracks'></Route>

              <Route path='/'>
                <FullLayout>
                  <Landing />
                </FullLayout>
                <div className={styles.site_footer}>
                  <SiteFooter />
                </div>
              </Route>
            </Switch>
          </div>
        </Router>
        {this.renderProcessingIndicator()}
        <Modal type={modalType} modalProps={modalProps} />
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    isProcessingTransaction: usm.selectors.isProcessingTransaction(state),
    modalType: ui.selectors.getModalType(state),
    modalProps: ui.selectors.getModalProps(state),
    accountAddress: web3.selectors.getAccountAddress(state)
  };
}

export default connect(mapStateToProps)(App);
