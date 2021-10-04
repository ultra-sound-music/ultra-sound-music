import { takeLatest, put, select } from 'redux-saga/effects';
import mediator from '@store/mediator';
import * as actions from '../actions';
import * as selectors from '../selectors';
import * as actionTypes from '../actionTypes';
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

  const activeAccount = yield select(selectors.getAccountAddress);
  if (account !== activeAccount) {
    yield put(mediator.actions.initApp());
    return;
  }

  yield put(actions.updateNetworkStatus({ status, account }));
}

export function* processNetworkUpdate({ data }) {
  const { networkId } = data;

  const activeNetworkId = yield select(selectors.getNetworkId);
  if (activeNetworkId !== networkId) {
    yield put(actions.init());
    return;
  }

  yield put(actions.updateNetworkStatus({ networkId }));
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
        mediator.actions.showModal({
          title: 'Unrecognized Network',
          body: 'Please switch to a valid Ethereum network.'
        })
      );
    } else {
      yield put(
        mediator.actions.showAppMessage({
          title: 'Test Mode',
          message: 'You have connected using an Ethereum test network',
          timeout: 4000
        })
      );
    }
  }
}

export default function* web3Saga() {
  yield takeLatest(actionTypes.INIT_WEB3, Workers.init);
  yield takeLatest(actionTypes.INSTALL_WALLET, Workers.installWallet);
  yield takeLatest(actionTypes.CONNECT_WALLET, Workers.connectWallet);
  yield takeLatest(actionTypes.PROCESS_ACCOUNT_UPDATE, processAccountUpdate);
  yield takeLatest(actionTypes.PROCESS_NETWORK_UPDATE, processNetworkUpdate);
  yield takeLatest(actionTypes.UPDATE_NETWORK_STATUS, onUpdateNetworkStatus);
}
