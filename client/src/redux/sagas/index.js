import { fork, all } from 'redux-saga/effects'
import appSaga from './app';
import web3Saga from './web3';

export default function* rootSaga () {
  yield all([
      fork(appSaga),
      fork(web3Saga)
  ]);
}