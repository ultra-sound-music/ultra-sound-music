import { put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from '../../actionTypes';
import * as Actions from '../../actions';

function* initApp() {
  yield put(Actions.web3.init());
}

export default function* appSaga() {
  yield takeLatest(ActionTypes.INIT_APP, initApp);
}