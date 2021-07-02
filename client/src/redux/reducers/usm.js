import { createReducer } from '@reduxjs/toolkit'
import * as ActionTypes from '../actionTypes';
import tokensAdapter from '../utils/tokensAdapter';

const initialState = tokensAdapter.getInitialState({
  activeArtist: null
});

export function setTokens(state, { data }) {
  tokensAdapter.setAll(state, data?.tokens);
}

export function setActiveArtist(state, { data }) {
  state.activeArtist = data?.artistTokenId;
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.SET_TOKENS, setTokens)
    .addCase(ActionTypes.SET_ACTIVE_ARTIST, setActiveArtist)
});