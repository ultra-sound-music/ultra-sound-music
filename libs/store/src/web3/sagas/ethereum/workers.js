import { call } from 'redux-saga/effects';
import EthClient, { isValidProductionNetworkId, isValidTestNetworkId } from '@lib/EthClient';
import * as web3Helpers from '../helpers';
import * as helpers from './helpers';

export function* init(action) {
  yield call([web3Helpers, web3Helpers.init], action, {
    web3Client: new EthClient({ ethereum: window.ethereum }),
    eventListeners: helpers.coreEventListeners,
    autoConnect: true
  });
}

export function* installWallet() {
  yield call(console.log);
}

export function* connectWallet(action) {
  yield call([web3Helpers, web3Helpers.connectWallet], action, {
    parseError(error) {
      let body;
      if (error.code === -32002) {
        body =
          'There was an error connecting to MetaMask. Please try connecting manually to MetaMask by clicking on the MetaMask wallet.';
      } else if (error.code === 4001) {
        body = 'The request to connect was rejected.';
      } else {
        body = 'There was an error connecting to MetaMask';
      }

      console.error(error);
      return body;
    }
  });
}

export function* processAccountUpdate(action) {
  yield call([web3Helpers, web3Helpers.processAccountUpdate], action);
}

export function* processNetworkUpdate(action) {
  yield call([web3Helpers, web3Helpers.processNetworkUpdate], action);
}

export function* onUpdateNetworkStatus(action) {
  yield call([web3Helpers, web3Helpers.onUpdateNetworkStatus], action, {
    isValidProductionNetworkId,
    isValidTestNetworkId
  });
}
