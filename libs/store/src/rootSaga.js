import { fork, all } from 'redux-saga/effects';
import appSaga from './app/sagas';
import playback from './playback/sagas';
import usm from './usm/sagas';
import web3Saga from './web3/sagas';

export default function* rootSaga() {
  yield all([fork(appSaga), fork(playback), fork(usm), fork(web3Saga)]);
}
