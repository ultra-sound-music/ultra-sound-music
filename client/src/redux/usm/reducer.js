import { createReducer } from '@reduxjs/toolkit';
import constants from '@constants';
import * as ActionTypes from './actionTypes';
import { mapTokenProps, tokensAdapter } from '@store/utils';

const initialState = tokensAdapter.getInitialState({
  activeArtistId: null,
  activeBandId: null,
  transactions: [],
  isFetchingTokens: false,
  isProcessingTransaction: false,
  newMints: []
});

export function initUsm(state) {
  // HACK - preserve new mints between connected sessions
  if (state.newMints.length) {
    return Object.assign({}, initialState, { newMints: state.newMints });
  }

  state = initialState;
}

export function onFetchNewMintsSuccess(state /*, { payload = {} }*/) {
  // state.newMints = payload?.mints;
  state.newMints = [
    {
      tokenType: 'artist',
      tokenId: 2,
      id: '1233',
      name: 'Rodrigo',
      image:
        'https://storageapi.fleek.co/dongambas-team-bucket/tepeyollotl.png',
      price: 2.5
    },
    {
      tokenType: 'artist',
      tokenId: 3,
      id: '1234',
      name: 'Minelirma',
      image:
        'https://storageapi.fleek.co/dongambas-team-bucket/quetzalcoatl.png',
      price: 2.5
    },
    {
      tokenType: 'artist',
      tokenId: 4,
      id: '1235',
      name: 'Bondigano',
      image: 'https://storageapi.fleek.co/dongambas-team-bucket/patecatl.png',
      price: 2.5
    },
    {
      tokenType: 'artist',
      tokenId: 5,
      id: '1236',
      name: 'Luciana',
      image: 'https://storageapi.fleek.co/dongambas-team-bucket/xolotl.png',
      price: 2.5
    },
    {
      tokenType: 'artist',
      tokenId: 5,
      id: '1236',
      name: 'Samuela',
      image:
        'https://storageapi.fleek.co/dongambas-team-bucket/chalchiuhtlicue.png',
      price: 2.5
    },
    {
      tokenType: 'artist',
      tokenId: 5,
      id: '1236',
      name: 'Timbaleo',
      image:
        'https://storageapi.fleek.co/dongambas-team-bucket/tezcatlipoca.png',
      price: 2.5
    }
  ];
}

export function onFetchTokensRequest(state) {
  state.isFetchingTokens = true;
}

export function onFetchTokensComplete(state, { data }) {
  state.isFetchingTokens = false;
  state.isProcessingTransaction = false;
  tokensAdapter.setAll(state, mapTokenProps(data?.tokens));
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
    status = constants.usm.transactionStatus.SUBMITTED,
    errorCode,
    errorMessage
  } = data;

  if (status === constants.usm.transactionStatus.SUBMITTED) {
    state.isProcessingTransaction = true;
  }

  state.transactions.push({
    method,
    key,
    transactionId,
    status,
    errorCode,
    errorMessage
  });
}

function updateTransaction(state, { data }) {
  const {
    key,
    transactionId,
    status = constants.usm.transactionStatus.SUBMITTED,
    errorCode,
    errorMessage
  } = data;

  const updatedTransactions = state.transactions.map((tx) => {
    if (tx.transactionId === transactionId || tx.key === key) {
      tx = Object.assign(tx, {
        transactionId,
        status,
        errorCode,
        errorMessage
      });
      return tx;
    }

    return tx;
  });

  if (status === constants.usm.transactionStatus.FAILED) {
    state.isProcessingTransaction = false;
  }

  state.transactions = updatedTransactions;
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(ActionTypes.INIT_USM, initUsm)
    .addCase(ActionTypes.FETCH_NEW_MINTS_SUCCESS, onFetchNewMintsSuccess)
    .addCase(ActionTypes.FETCH_TOKENS_REQUEST, onFetchTokensRequest)
    .addCase(ActionTypes.FETCH_TOKENS_COMPLETE, onFetchTokensComplete)
    .addCase(ActionTypes.SET_ACTIVE_ARTIST, setActiveArtist)
    .addCase(ActionTypes.SET_ACTIVE_BAND, setActiveBand)
    .addCase(ActionTypes.ADD_TRANSACTION, addTransaction)
    .addCase(ActionTypes.UPDATE_TRANSACTION, updateTransaction);
});
