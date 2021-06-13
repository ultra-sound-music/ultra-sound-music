import { createReducer } from '@reduxjs/toolkit'

import * as Constants from '../../constants';
import * as ActionTypes from '../actionTypes';

const initialState = {
  isInitialized: false,
  networkStatus: Constants.web3.NOT_AVAILABLE,
  address: null,
  chainId: null,
  transactions: []  
};

function initWeb3Success(state) {
  state.isInitialized = true;
}

function updateNetworkStatus(state, { data }) {
  state.networkStatus = data?.status ?? initialState.networkStatus;
  state.address = data?.address ?? initialState.address;
  state.chainId = data?.chainId ?? initialState.chainId;
}

function updateNetworkChain(state, { data }) {
  state.chainId = data?.chainId ?? initialState.chainId;
}

function setTransaction(state, { data }) {
  const transactionId = data?.transactionId || '';
  state.transactionId = transactionId;
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.INIT_WEB3_SUCCESS, initWeb3Success)
    .addCase(ActionTypes.UPDATE_NETWORK_STATUS, updateNetworkStatus)
    .addCase(ActionTypes.UPDATE_NETWORK_CHAIN, updateNetworkChain)
    .addCase(ActionTypes.SET_TRANSACTION, setTransaction)
});
