import { createReducer } from '@reduxjs/toolkit'
import * as ActionTypes from '../actionTypes';

const initialState = {
  source: null,  // If source is a string then it's an address, if it's a number it's a tokenId
  status: 'stopped',
}

export function playbackStarted(state, { data }) {
  state.source = data?.source;
  state.status = 'playing';
}

export function playbackStopped(state) {
  state.source = initialState.source;
  state.status = 'stopped';
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.PLAY_SUCCESS, playbackStarted)
    .addCase(ActionTypes.STOP_SUCCESS, playbackStopped)
});