import * as ActionTypes from '../actionTypes';

export function init() {
  return {
    type: ActionTypes.INIT_ENTITIES
  }
}

export function setTokens(tokens) {
  return {
    type: ActionTypes.SET_TOKENS,
    data: {
      tokens
    }
  };
}