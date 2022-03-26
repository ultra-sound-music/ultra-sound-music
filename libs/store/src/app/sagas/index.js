import { takeLatest } from 'redux-saga/effects';
import mediator from '@usm/store/mediator';
import * as actionTypes from '../actionTypes';
import * as workers from './workers';

export default function* appSaga() {
  yield takeLatest(actionTypes.INIT_APP, workers.initApp);
  yield takeLatest(mediator.actionTypes.INIT_WEB3_SUCCESS, workers.onInitWeb3Success);
}
