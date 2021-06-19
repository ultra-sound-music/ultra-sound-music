import { createReducer } from '@reduxjs/toolkit'
import * as ActionTypes from '../actionTypes';
import tokensAdapter from '../utils/tokensAdapter';

export function setTokens(state, { data }) {
  tokensAdapter.setAll(state, data?.tokens);
}

export default createReducer(tokensAdapter.getInitialState(), (builder) => {
  builder
    .addCase(ActionTypes.SET_TOKENS, setTokens)
});