// import { eventChannel } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../../actionTypes';
import * as Workers from './workers';

export default function* usmSaga() {
  yield takeLatest(ActionTypes.INIT_USM, Workers.init);
  yield takeLatest(ActionTypes.FETCH_NEW_MINTS_REQUEST, Workers.fetchNewMints);
  yield takeLatest(ActionTypes.FETCH_TOKENS_REQUEST, Workers.fetchAllTokens);
  yield takeLatest(ActionTypes.CREATE_ARTIST_REQUEST, Workers.createArtist);
  yield takeLatest(ActionTypes.START_BAND_REQUEST, Workers.startBand);
  yield takeLatest(ActionTypes.JOIN_BAND_REQUEST, Workers.joinBand);
  yield takeLatest(ActionTypes.CREATE_TRACK_REQUEST, Workers.createTrack);
}
