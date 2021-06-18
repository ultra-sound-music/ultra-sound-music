import { put, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import * as Constants from '../../../constants';
import * as Actions from '../../actions';
import * as Utils from '../../../utils';

const coreEventListeners = {
  [Constants.web3.providerEventNames.ACCOUNTS_CHANGED]: getAccountChangedAction,
  [Constants.web3.providerEventNames.CHAIN_CHANGED]: getChainChangedAction
}

export function* startWatchingForEthereumEvents() {
  const ethereum = Utils.web3.getEthereumProvider();
  if (!ethereum) {
    return;
  }

  const ethereumEventChannel = createEthereumEventChannel(ethereum)
  yield takeEvery(ethereumEventChannel, function* (action) {
    yield put(action);
  });
}

export function getAccountChangedAction(accounts) {
  const account = accounts?.[0];
  if (account) {
    return Actions.web3.updateNetworkStatus(Constants.web3.networkStatus.CONNECTED, account);
  } else {
    return Actions.web3.updateNetworkStatus(Constants.web3.networkStatus.NOT_CONNECTED);
  }
}


// @TODO - Is this the same thing as changing Chains?  Should I update the event that triggers getAccountChangedAction()?
// Got this from https://docs.ethers.io/v5/concepts/best-practices/  
// const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
// provider.on("network", (newNetwork, oldNetwork) => {
//     if (oldNetwork) {
//         window.location.reload();
//     }
// });


export function getChainChangedAction(chainId) {
  return Actions.web3.updateNetworkChain(chainId);
}

export function createEthereumEventChannel(ethereum) {
  return eventChannel((emit) => {
    const boundEventListeners = Utils.web3.bindCoreEventListeners(emit, ethereum, coreEventListeners);
    return () => {  
      Utils.web3.removeCoreEventListeners(boundEventListeners);
    }
  })
}

export function* onChainChaingedGenerator() {
  
}

// window.onAccountsChangedEvent = onAccountsChangedEvent;
// window.onChainChangedEvent = onChainChangedEvent;