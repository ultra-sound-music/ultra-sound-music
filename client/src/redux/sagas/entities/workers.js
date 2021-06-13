import { call, put } from 'redux-saga/effects'
import * as Actions from '../../actions';
import * as Services from '../../../services';

export function* init() {
  const { data } = yield call(Services.getAllTokens);
  yield put(Actions.entities.setTokens(data));
}