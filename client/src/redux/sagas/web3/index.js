import { takeLatest, put, select } from 'redux-saga/effects';
import * as Actions from '../../actions';
import * as Selectors from '../../selectors/core';
import * as ActionTypes from '../../actionTypes';
import * as Workers from './__BLOCKCHAIN_NAME__/workers';

// @TODO - These should be moved into the Ethereum Client and not the concern of the app or sagas
const validProductionChainIds = {
  MAINNET: 1
};

const validTestChainIds = {
  RINKEBY: 4,
  LOCAL: 31337
};

export function isValidTestNetworkId(networkId) {
  return Object.values(validTestChainIds).includes(networkId);
}

export function isValidProductionNetworkId(networkId) {
  return Object.values(validProductionChainIds).includes(networkId);
}

export function* processAccountUpdate({ data }) {
  const { status, account } = data;

  const activeAccount = yield select(Selectors.web3.getAccountAddress);
  if (account !== activeAccount) {
    yield put(Actions.app.init());
    return;
  }

  yield put(Actions.web3.updateNetworkStatus({ status, account }));
}

export function* processNetworkUpdate({ data }) {
  const { networkId } = data;

  const activeNetworkId = yield select(Selectors.web3.getNetworkId);
  if (activeNetworkId !== networkId) {
    yield put(Actions.app.init());
    return;
  }

  yield put(Actions.web3.updateNetworkStatus({ networkId }));
}

export function* onUpdateNetworkStatus({ data }) {
  const { networkId } = data;
  if (!networkId) {
    return;
  }

  const isValidProductionNetwork = isValidProductionNetworkId(networkId);
  if (!isValidProductionNetwork) {
    const isValidTestNetwork = isValidTestNetworkId(networkId);
    if (!isValidTestNetwork) {
      yield put(
        Actions.ui.showModal({
          title: 'Unrecognized Network',
          body: 'Please switch to a valid Ethereum network.'
        })
      );
    } else {
      yield put(
        Actions.ui.showAppMessage({
          title: 'Test Mode',
          message: 'You have connected using an Ethereum test network',
          timeout: 4000
        })
      );
    }
  }
}

export default function* web3Saga() {
  yield takeLatest(ActionTypes.INIT_WEB3, Workers.init);
  yield takeLatest(ActionTypes.INSTALL_WALLET, Workers.installWallet);
  yield takeLatest(ActionTypes.CONNECT_WALLET, Workers.connectWallet);
  yield takeLatest(ActionTypes.PROCESS_ACCOUNT_UPDATE, processAccountUpdate);
  yield takeLatest(ActionTypes.PROCESS_NETWORK_UPDATE, processNetworkUpdate);
  yield takeLatest(ActionTypes.UPDATE_NETWORK_STATUS, onUpdateNetworkStatus);
}
