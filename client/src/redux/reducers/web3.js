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

function addTransaction(state, { data }) {
  const {
    method,
    key,
    transactionId,
    block,
    status = Constants.web3.transactionStatus.SUBMITTED,
    errorCode,
    errorMessage
  } = data;

  state.transactions.push({
    method,
    key,
    transactionId,
    block,
    status,
    errorCode,
    errorMessage    
  });
}

function updateTransaction(state, { data }) {
  // @TODO
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.INIT_WEB3_SUCCESS, initWeb3Success)
    .addCase(ActionTypes.UPDATE_NETWORK_STATUS, updateNetworkStatus)
    .addCase(ActionTypes.UPDATE_NETWORK_CHAIN, updateNetworkChain)
    .addCase(ActionTypes.ADD_TRANSACTION, addTransaction)
    .addCase(ActionTypes.UPDATE_TRANSACTION, updateTransaction)
});
