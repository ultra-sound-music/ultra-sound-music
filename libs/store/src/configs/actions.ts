import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from './actionTypes';

export const updateConfigs = createAction(ActionTypes.UPDATE_CONFIGS, (configs) => {
  return {
    payload: configs
  };
});
