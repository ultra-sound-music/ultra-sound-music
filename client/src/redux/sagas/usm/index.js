// import { eventChannel } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../../actionTypes';
import * as Workers from './workers';

export default function* web3Saga() {
  yield takeLatest(ActionTypes.INIT_USM, Workers.init);
  yield takeLatest(ActionTypes.UPDATE_NETWORK_STATUS, Workers.update)
  yield takeLatest(ActionTypes.FETCH_TOKENS_REQUEST, Workers.fetchAllTokens);
  yield takeLatest(ActionTypes.CREATE_ARTIST_REQUEST, Workers.createArtist);
  yield takeLatest(ActionTypes.CREATE_BAND_REQUEST, Workers.createBand);
  yield takeLatest(ActionTypes.CREATE_TRACK_REQUEST, Workers.createTrack);
}
