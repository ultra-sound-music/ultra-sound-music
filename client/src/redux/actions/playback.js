import * as ActionType from '../actionTypes';

export function init() {
  return {
    type: ActionType.INIT_PLAYBACK
  }
}

export function play({ source }) {
  return {
    type: ActionType.PLAY,
    data: {
      source
    }
  };
}

export function playSuccess({ source }) {
  return {
    type: ActionType.PLAY_SUCCESS,
    data: {
      source
    }
  };
}

export function stop() {
  return {
    type: ActionType.STOP
  };
}

export function stopSuccess() {
  return {
    type: ActionType.STOP_SUCCESS
  };
}