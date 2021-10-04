export function selectActiveSource(state) {
  return state.playback.source;
}

export function isPlaying(state) {
  return state.playback.status === 'playing';
}
