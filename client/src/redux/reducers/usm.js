import { createReducer } from '@reduxjs/toolkit';
import * as Constants from '../../constants';
import * as ActionTypes from '../actionTypes';
import tokensAdapter from '../utils/tokensAdapter';

const initialState = tokensAdapter.getInitialState({
  activeArtistId: null,
  activeBandId: null,
  transactions: [],
  isFetchingTokens: false,
  isProcessingTransaction: false
});

export function initUsm() {
  return initialState;
}

export function onFetchTokensRequest(state) {
  state.isFetchingTokens = true;
}

export function onFetchTokensComplete(state, { data }) {
  state.isFetchingTokens = false;
  state.isProcessingTransaction = false;    
  tokensAdapter.setAll(state, data?.tokens);
}

export function setActiveArtist(state, { data }) {
  state.activeArtistId = data?.artistId;
}

export function setActiveBand(state, { data }) {
  state.activeBandId = data?.bandId;
}

function addTransaction(state, { data }) {
  const {
    method,
    key,
    transactionId,
    block,
    status = Constants.usm.transactionStatus.SUBMITTED,
    errorCode,
    errorMessage
  } = data;

  if (status === Constants.usm.transactionStatus.SUBMITTED) {
    state.isProcessingTransaction = true;    
  }

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
  const {
    key,
    transactionId,
    block,
    status = Constants.usm.transactionStatus.SUBMITTED,
    errorCode,
    errorMessage
  } = data;

  const updatedTransactions = state.transactions.map((tx) => {
    if( tx.transactionId === transactionId || tx.key === key ) {
      tx = Object.assign(tx, {
        transactionId,
        block,
        status,
        errorCode,
        errorMessage
      });
      return tx;
    }

    return tx;
  });

  if (status === Constants.usm.transactionStatus.FAILED) {
    state.isProcessingTransaction = false;
  }  

  state.transactions = updatedTransactions;  
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.INIT_USM, initUsm)
    .addCase(ActionTypes.FETCH_TOKENS_REQUEST, onFetchTokensRequest)
    .addCase(ActionTypes.FETCH_TOKENS_COMPLETE, onFetchTokensComplete)
    .addCase(ActionTypes.SET_ACTIVE_ARTIST, setActiveArtist)
    .addCase(ActionTypes.SET_ACTIVE_BAND, setActiveBand)
    .addCase(ActionTypes.ADD_TRANSACTION, addTransaction)
    .addCase(ActionTypes.UPDATE_TRANSACTION, updateTransaction)    
});