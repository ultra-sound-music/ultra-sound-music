import { fork, put } from 'redux-saga/effects';

import * as web3Actions from '../../actions';
import * as web3Constants from '../../constants';
import * as helpers from './helpers';
import SolClient from '@lib/SolClient';

let solClient;

export function* init() {
  solClient = new SolClient();
  const connectedAccount = solClient.getWalletAddress();
  if (solClient.isWeb3Available) {
    yield fork(helpers.startWatchingForSolanaEvents, solClient.wallet);
  }

  if (connectedAccount) {
    const networkId = solClient.getNetworkId();
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.CONNECTED,
        account: connectedAccount,
        networkId: parseInt(networkId)
      })
    );
  } else if (solClient.isWeb3Available) {
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.NOT_AVAILABLE
      })
    );
  }

  yield put(web3Actions.initWeb3Success({ web3Client: solClient }));
  return solClient;
}

export function installWallet() {
  // @TODO
}

export function connectWallet() {
  // @TODO
}

export function processAccountUpdate() {
  // @TODO
}

export function* processNetworkUpdate() {
  // @TODO
}

export function* onUpdateNetworkStatus() {
  // @TODO
}
