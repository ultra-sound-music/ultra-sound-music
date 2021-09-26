import { takeLatest, put, select } from 'redux-saga/effects';
import * as Actions from '../../actions';
import * as Selectors from '../../selectors/core';
import * as ActionTypes from '../../actionTypes';
import * as Workers from './__BLOCKCHAIN_NAME__/workers';

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

export default function* web3Saga() {
  yield takeLatest(ActionTypes.INIT_WEB3, Workers.init);
  yield takeLatest(ActionTypes.INSTALL_WALLET, Workers.installWallet);
  yield takeLatest(ActionTypes.CONNECT_WALLET, Workers.connectWallet);
  yield takeLatest(ActionTypes.PROCESS_ACCOUNT_UPDATE, processAccountUpdate);
  yield takeLatest(ActionTypes.PROCESS_NETWORK_UPDATE, processNetworkUpdate);
}
