import { createReducer } from '@reduxjs/toolkit';
import * as Constants from '../../constants';
import * as ActionTypes from '../actionTypes';
import tokensAdapter from '../utils/tokensAdapter';

const initialState = tokensAdapter.getInitialState({
  activeArtistId: null,
  activeBandId: null,
  transactions: []  
});

export function initUsm() {
  return initialState;
}

export function setTokens(state, { data }) {
  tokensAdapter.setAll(state, data?.tokens);
}

export function setActiveArtist(state, { data }) {
  state.activeArtistId = data?.artistTokenId;
}

export function setActiveBand(state, { data }) {
  state.activeBandId = data?.bandTokenId;
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

  state.transactions = updatedTransactions;  
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.INIT_USM, initUsm)
    .addCase(ActionTypes.SET_TOKENS, setTokens)
    .addCase(ActionTypes.SET_ACTIVE_ARTIST, setActiveArtist)
    .addCase(ActionTypes.SET_ACTIVE_BAND, setActiveBand)
    .addCase(ActionTypes.ADD_TRANSACTION, addTransaction)
    .addCase(ActionTypes.UPDATE_TRANSACTION, updateTransaction)    
});