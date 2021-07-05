import { takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '../../actionTypes';
import * as Workers from './workers';

export default function* appSaga() {
  yield takeLatest(ActionTypes.INIT_APP, Workers.initApp);
  yield takeLatest(ActionTypes.INIT_WEB3_SUCCESS, Workers.onInitWeb3Success);
}