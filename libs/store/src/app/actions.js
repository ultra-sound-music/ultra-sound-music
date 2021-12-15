import * as ActionTypes from './actionTypes';

export function init({ isUpdate } = {}) {
  return {
    type: ActionTypes.INIT_APP,
    payload: {
      isUpdate,
    },
  };
}
