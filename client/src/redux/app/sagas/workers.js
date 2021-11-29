import { put } from 'redux-saga/effects';
import mediator from '@store/mediator';

export function* initApp({ payload }) {
  yield put(mediator.actions.initWeb3(!!payload?.isUpdate));
}

export function* onInitWeb3Success({ payload }) {
  yield put(
    mediator.actions.initUsm({
      web3Client: payload.web3Client
    })
  );
}
