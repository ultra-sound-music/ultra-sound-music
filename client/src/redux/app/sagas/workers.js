import { put } from 'redux-saga/effects';
import mediator from '@store/mediator';

export function* initApp() {
  yield put(mediator.actions.initWeb3());
  yield put(mediator.actions.initPlayback());
}

export function* onInitWeb3Success({ data }) {
  yield put(mediator.actions.initUsm({ web3Client: data.web3Client }));
}
