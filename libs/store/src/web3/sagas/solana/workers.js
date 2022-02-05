import { call } from 'redux-saga/effects';

import * as web3Helpers from '../helpers';
import * as helpers from './helpers';
import SolClient from '@lib/SolClient';

export function* init(action) {
  yield call([web3Helpers, web3Helpers.init], action, {
    web3Client: new SolClient(),
    eventListeners: helpers.coreEventListeners,
    autoConnect: action?.payload?.autoConnect
  });
}

export function* installWallet() {
  // @TODO
}

export function* connectWallet(action) {
  yield call([web3Helpers, web3Helpers.connectWallet], action, {
    parseError(error) {
      console.log(error);
      return 'There was an error connecting: 5678';
    }
  });
}

export function* processAccountUpdate(action) {
  yield call([web3Helpers, web3Helpers.processAccountUpdate], action);
}

export function* processNetworkUpdate(action) {
  yield call([web3Helpers, web3Helpers.processNetworkUpdate], action);
}
