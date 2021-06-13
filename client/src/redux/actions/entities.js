import * as ActionTypes from '../actionTypes';

export function init() {
  return {
    type: ActionTypes.INIT_ENTITIES
  }
}

export function setEntities(entities) {
  return {
    type: ActionTypes.SET_ENTITIES,
    data: {
      entities
    }
  };
}