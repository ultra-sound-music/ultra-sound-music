import { createReducer } from '@reduxjs/toolkit';
import * as ActionTypes from './actionTypes';

/**
 * source interface:
 * {
 *    audioUrl: '',
 *    entityId: '',
 *    isLoading: boolean
 * }
 */

const initialState = {
  isPlaying: false,
  activeSource: null, // entityId
  sources: []
};

export function updateSource(sources, updates) {
  const foundIndex = sources.findIndex((source) => {
    return (
      source.audioUrl === updates.audioUrl ||
      source.entityId === updates.entityId
    );
  });

  if (foundIndex) {
    const source = sources[foundIndex];
    sources[foundIndex] = Object.assign({}, source, updates);
  } else {
    sources.push(updates);
  }

  return sources;
}

export function playbackStarted(state, { payload }) {
  const entityId = payload?.entityId;
  const audioUrl = payload?.audioUrl;

  (state.isPlaying = true), (state.activeSource = entityId);
  state.sources = updateSource(state.sources, {
    entityId,
    audioUrl,
    isLoading: true
  });
}

export function playbackStopped(state) {
  const activeSource = state.activeSource;

  state.isPlaying = false;
  state.sources = updateSource(state.sources, {
    entityId: activeSource,
    isLoading: false
  });
}

export function onLoadSuccess(state, { audioUrl }) {
  state.sources = updateSource(state.sources, {
    audioUrl,
    isLoading: false
  });
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.PLAY_SUCCESS, playbackStarted)
    .addCase(ActionTypes.STOP_SUCCESS, playbackStopped)
    .addCase(ActionTypes.ON_LOAD_SUCCESS, onLoadSuccess);
});
