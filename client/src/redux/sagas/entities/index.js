import { takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../../actionTypes';
import * as Workers from './workers';

export default function* web3Saga() {
  yield takeLatest(ActionTypes.INIT_ENTITIES, Workers.init);
}