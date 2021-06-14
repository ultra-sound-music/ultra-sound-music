import { fork, all } from 'redux-saga/effects'
import appSaga from './app';
import entities from './entities';
import playback from './playback';
import web3Saga from './web3';


export default function* rootSaga () {
  yield all([
      fork(appSaga),
      fork(entities),
      fork(playback),
      fork(web3Saga)
  ]);
}