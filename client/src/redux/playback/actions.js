import * as ActionType from './actionTypes';

export function init() {
  return {
    type: ActionType.INIT_PLAYBACK
  };
}

export function play({ entityId }) {
  return {
    type: ActionType.PLAY,
    data: {
      entityId
    }
  };
}

export function playSuccess({ entityId }) {
  return {
    type: ActionType.PLAY_SUCCESS,
    data: {
      entityId
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
