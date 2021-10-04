import { takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../actionTypes';
import * as Workers from './workers';

export default function* playbackSaga() {
  yield takeLatest(ActionTypes.INIT_PLAYBACK, Workers.init);
  yield takeLatest(ActionTypes.PLAY, Workers.toggle);
  yield takeLatest(ActionTypes.STOP, Workers.toggle);
}
