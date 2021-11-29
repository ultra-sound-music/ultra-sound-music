import { put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import * as constants from '../../constants';
import * as actions from '../../actions';
import * as web3Utils from '../../utils';

import * as solanaConstants from './constants';

let solanaEventChannel;

const coreEventListeners = {
  [solanaConstants.CONNECT]: onAccountsChanged
  // [ethereumConstants.providerEventNames.CHAIN_CHANGED]: onChainChanged
};

export function* startWatchingForSolanaEvents(provider) {
  if (solanaEventChannel) {
    solanaEventChannel.close();
  }

  solanaEventChannel = createSolanaEventChannel(provider);
  yield takeEvery(solanaEventChannel, function* (action) {
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

export function createSolanaEventChannel(provider) {
  return eventChannel((emitter) => {
    const boundEventListeners = web3Utils.bindCoreEventListeners(
      emitter,
      provider,
      coreEventListeners
    );
    debugger;
    return () => {
      web3Utils.removeCoreEventListeners(provider, boundEventListeners);
    };
  });
}
