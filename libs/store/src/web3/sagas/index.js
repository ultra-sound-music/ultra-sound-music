import { takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes';
import * as Workers from './__BLOCKCHAIN_NAME__/workers';

export default function* web3Saga() {
  yield takeLatest(actionTypes.INIT_WEB3, Workers.init);
  yield takeLatest(actionTypes.INSTALL_WALLET, Workers.installWallet);
  yield takeLatest(actionTypes.CONNECT_WALLET, Workers.connectWallet);
  yield takeLatest(actionTypes.PROCESS_ACCOUNT_UPDATE, Workers.processAccountUpdate);
  yield takeLatest(actionTypes.PROCESS_NETWORK_UPDATE, Workers.processNetworkUpdate);
  yield takeLatest(actionTypes.UPDATE_NETWORK_STATUS, Workers.onUpdateNetworkStatus);
}
