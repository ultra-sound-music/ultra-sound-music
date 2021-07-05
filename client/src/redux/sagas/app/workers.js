import { put } from 'redux-saga/effects'
import * as Actions from '../../actions';

export function* initApp() {
  yield put(Actions.web3.init());
  yield put(Actions.playback.init());
}

export function* onInitWeb3Success({ data }) {
  yield put(Actions.usm.init({ web3Client: data.web3Client }));
}
