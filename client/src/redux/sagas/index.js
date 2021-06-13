import { fork, all } from 'redux-saga/effects'
import appSaga from './app';
import web3Saga from './web3';
import entities from './entities';

export default function* rootSaga () {
  yield all([
      fork(appSaga),
      fork(entities),
      fork(web3Saga)
  ]);
}