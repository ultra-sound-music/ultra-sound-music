import { fork, all } from 'redux-saga/effects'
import appSaga from './app';
import playback from './playback';
import usm from './usm';
import web3Saga from './web3';


export default function* rootSaga () {
  yield all([
      fork(appSaga),
      fork(playback),
      fork(usm),      
      fork(web3Saga)
  ]);
}