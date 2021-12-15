import { createReducer } from '@reduxjs/toolkit';
import * as ActionTypes from './actionTypes';

const initialState = {
  lfg: true,
  isArtistOnly: true,
};

export function updateConfig(state, { payload }) {
  Object.assign(state, payload);
}

export default createReducer(initialState, (builder) => {
  return builder.addCase(ActionTypes.UPDATE_CONFIGS, updateConfig);
});
