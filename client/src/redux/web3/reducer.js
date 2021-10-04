import { createReducer } from '@reduxjs/toolkit';
import * as ActionTypes from './actionTypes';

const initialState = {
  networkStatus: null,
  account: null,
  networkId: null
};

function initWeb3() {
  return initialState;
}

function updateNetworkStatus(state, { data }) {
  state.networkStatus = data?.status ?? initialState.networkStatus;
  state.account = data?.account ?? initialState.account;
  state.networkId = data?.networkId ?? initialState.networkId;
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.INIT_WEB3, initWeb3)
    .addCase(ActionTypes.UPDATE_NETWORK_STATUS, updateNetworkStatus);
});
