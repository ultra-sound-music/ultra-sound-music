import { put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import * as constants from '../../constants';
import * as actions from '../../actions';
import * as web3Utils from '../../utils';

import * as ethereumConstants from './constants';

let ethereumEventChannel;

const coreEventListeners = {
  [ethereumConstants.providerEventNames.ACCOUNTS_CHANGED]: onAccountsChanged,
  [ethereumConstants.providerEventNames.CHAIN_CHANGED]: onChainChanged
};

export function* startWatchingForEthereumEvents(ethereum) {
  if (ethereumEventChannel) {
    ethereumEventChannel.close();
  }

  ethereumEventChannel = createEthereumEventChannel(ethereum);
  yield takeEvery(ethereumEventChannel, function* (action) {
    yield put(action);
  });
}

export function onAccountsChanged(accounts) {
  const account = accounts?.[0];
  if (account) {
    return actions.processAccountUpdate({
      status: constants.networkStatus.CONNECTED,
      account
    });
  } else {
    return actions.processAccountUpdate({
      status: constants.networkStatus.NOT_CONNECTED
    });
  }
}

export function onChainChanged(chainId) {
  return actions.processNetworkUpdate({ networkId: parseInt(chainId) });
}

export function createEthereumEventChannel(ethereum) {
  return eventChannel((emitter) => {
    const boundEventListeners = web3Utils.bindCoreEventListeners(
      emitter,
      ethereum,
      coreEventListeners
    );
    return () => {
      web3Utils.removeCoreEventListeners(ethereum, boundEventListeners);
    };
  });
}
