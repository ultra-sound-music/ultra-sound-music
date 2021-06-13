import { createReducer } from '@reduxjs/toolkit'
import * as ActionTypes from '../actionTypes';

const initialState = {
  entities: []
};

export function setEntities(state, { data }) {
  state.entities = data?.entities ?? []
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.INIT_WEB3_SUCCESS, setEntities)
});