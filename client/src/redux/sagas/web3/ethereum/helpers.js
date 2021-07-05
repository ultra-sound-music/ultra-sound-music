import { put, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import * as Constants from '../../../../constants';
import * as EthereumConstants from './constants';
import * as Actions from '../../../actions';
import * as Utils from '../../../../utils';

let ethereumEventChannel;

const coreEventListeners = {
  [EthereumConstants.providerEventNames.ACCOUNTS_CHANGED]: onAccountsChanged,
  [EthereumConstants.providerEventNames.CHAIN_CHANGED]: onChainChanged
}

export function* startWatchingForEthereumEvents(ethereum) {
  if (ethereumEventChannel) {
    ethereumEventChannel.close();
  }

  ethereumEventChannel = createEthereumEventChannel(ethereum)
  yield takeEvery(ethereumEventChannel, function* (action) {
    yield put(action);
  });
}

export function onAccountsChanged(accounts) {
  const account = accounts?.[0];
  if (account) {
    return Actions.web3.processAccountUpdate({ status: Constants.web3.networkStatus.CONNECTED, account });
  } else {
    return Actions.web3.processAccountUpdate({ status: Constants.web3.networkStatus.NOT_CONNECTED });
  }
}

export function onChainChanged(chainId) {
  return Actions.web3.processNetworkUpdate({ networkId: chainId });
}

export function createEthereumEventChannel(ethereum) {
  return eventChannel((emitter) => {
    const boundEventListeners = Utils.web3.bindCoreEventListeners(emitter, ethereum, coreEventListeners);
    return () => {  
      Utils.web3.removeCoreEventListeners(ethereum, boundEventListeners);
    }
  })
}