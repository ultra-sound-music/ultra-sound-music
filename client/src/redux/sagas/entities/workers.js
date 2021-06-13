import { call, put } from 'redux-saga/effects'
import * as Actions from '../../actions';
import * as Services from '../../../services';

export function* init() {
  const entities = yield call(Services.getAllEntities);
  yield put(Actions.entities.setEntities(entities));
}