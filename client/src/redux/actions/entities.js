import * as ActionTypes from '../actionTypes';

export function setEntities(entities) {
  return {
    type: ActionTypes.SET_ENTITIES,
    data: {
      entities
    }
  };
}