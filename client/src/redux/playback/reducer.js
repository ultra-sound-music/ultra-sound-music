import { createReducer } from '@reduxjs/toolkit';
import * as ActionTypes from './actionTypes';

const initialState = {
  source: '',
  status: 'stopped'
};

export function playbackStarted(state, { data }) {
  state.source = data?.entityId;
  state.status = 'playing';
}

export function playbackStopped(state) {
  state.source = initialState.source;
  state.status = initialState.status;
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.PLAY_SUCCESS, playbackStarted)
    .addCase(ActionTypes.STOP_SUCCESS, playbackStopped);
});
