import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { FullLayout } from '@layouts';
import { SiteFooter, Overlay, Spinner } from '@uiComponents';
import usm from '@store/usm';
import ui from '@store/ui';
import web3 from '@store/web3';
import configs from '@store/configs';

// import About from './components/About';
// import User from './components/User';
import AppMessage from '@appComponents/AppMessage/AppMessage';
import SiteHeader from '@appComponents/SiteHeader/SiteHeader';
import Modal from '@appComponents/Modal/Modal';
import Landing from './pages/Landing/Landing';
import LandingArtistOnly from './pages/LandingArtistOnly/LandingArtistOnly';
import ArtistsPage from './pages/ArtistsPage/ArtistsPage';
import MempoolPlayer from './pages/MempoolPlayer/MempoolPlayer';
import BandsPage from './pages/BandsPage/BandsPage';
import NotFound from './pages/NotFound/NotFound';
// import Token from './components/Tokens/Token';
// import Searchable from './components/Searchable';

import styles from './App.scss';

export class App extends React.Component {
  static propTypes = {
    isArtistOnly: PropTypes.bool,
    accountAddress: PropTypes.string,
    isProcessingTransaction: PropTypes.bool,
    modalType: PropTypes.string,
    modalProps: PropTypes.object
  };

  renderProcessingIndicator() {
    if (this.props.isProcessingTransaction) {
      return (
        <Overlay>
          <Spinner cover='fixed' />
        </Overlay>
      );
    }
  }

  renderIsArtistOnly = () => {
    return (
      <>
        <div className='App'>
          <FullLayout>
            <AppMessage />
            <div className={styles.site_header}>
              <SiteHeader />
            </div>
          </FullLayout>
          <Switch>
            <Route exact path='/'>
              <LandingArtistOnly />
              <div className={styles.site_footer}>
                <SiteFooter />
              </div>
            </Route>

            <Route path='/artists'>{<ArtistsPage />}</Route>

            <Route path='/memplayer'>{<MempoolPlayer />}</Route>

            <Route path='*'>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </>
    );
  };

  renderDefault = () => {
    return (
      <>
        <div className='App'>
          <FullLayout>
            <AppMessage />
            <div className={styles.site_header}>
              <SiteHeader />
            </div>
          </FullLayout>
          <Switch>
            <Route exact path='/'>
              <Landing />
              <div className={styles.site_footer}>
                <SiteFooter />
              </div>
            </Route>

            <Route path='/bands'>
              <BandsPage />
            </Route>

            <Route path='/tracks'></Route>

            <Route path='*'>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </>
    );
  };

  render() {
    const { modalType, modalProps } = this.props;

    return (
      <div>
        <Router>
          {this.props.isArtistOnly
            ? this.renderIsArtistOnly()
            : this.renderDefault()}
          <Modal type={modalType} modalProps={modalProps} />
        </Router>
        {this.renderProcessingIndicator()}
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    isArtistOnly: configs.selectors.getIsArtistOnly(state),
    isProcessingTransaction: usm.selectors.isProcessingTransaction(state),
    modalType: ui.selectors.getModalType(state),
    modalProps: ui.selectors.getModalProps(state),
    accountAddress: web3.selectors.getAccountAddress(state)
  };
}

export default connect(mapStateToProps)(App);
