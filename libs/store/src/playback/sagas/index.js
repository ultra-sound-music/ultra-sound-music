import { takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../actionTypes';
import * as Workers from './workers';

export default function* playbackSaga() {
  yield takeLatest(ActionTypes.PLAY, Workers.play);
  yield takeLatest(ActionTypes.STOP, Workers.stop);
}
