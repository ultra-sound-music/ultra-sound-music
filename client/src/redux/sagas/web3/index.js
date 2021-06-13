// import { eventChannel } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../../actionTypes';
import * as Workers from './workers';

export default function* web3Saga() {
  yield takeLatest(ActionTypes.INIT_WEB3, Workers.init);
  yield takeLatest(ActionTypes.INSTALL_WALLET, Workers.installWallet);
  yield takeLatest(ActionTypes.CONNECT_WALLET, Workers.connectWallet);
}
