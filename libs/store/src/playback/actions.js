import * as ActionType from './actionTypes';

export function play({ entityId }) {
  return {
    type: ActionType.PLAY,
    payload: {
      entityId,
    },
  };
}

export function onPlaySuccess({ entityId }) {
  return {
    type: ActionType.PLAY_SUCCESS,
    payload: {
      entityId,
    },
  };
}

export function stop() {
  return {
    type: ActionType.STOP,
  };
}

export function onStopSuccess() {
  return {
    type: ActionType.STOP_SUCCESS,
  };
}

export function onLoadSuccess({ audioUrl }) {
  return {
    type: ActionType.ON_LOAD_SUCCESS,
    payload: {
      audioUrl,
    },
  };
}
