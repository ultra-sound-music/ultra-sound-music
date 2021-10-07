import { createSelector } from '@reduxjs/toolkit';

export function getPlaybackState(state) {
  return state.playback;
}

export const selectActiveSource = createSelector(
  getPlaybackState,
  (playback) => playback.activeSource
);

export const isPlaying = createSelector(
  getPlaybackState,
  (playback) => !!playback.isPlaying
);
