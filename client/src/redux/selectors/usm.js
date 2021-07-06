import { createSelector } from '@reduxjs/toolkit';
import * as Constants from '../../constants';
import * as Utils from '../../utils';
import tokensAdapter from '../utils/tokensAdapter';

const tokenSelectors = tokensAdapter.getSelectors((state) => state.usm)

export const {
  selectIds: selectTokenIds, 
  selectEntities: selectTokenEntities,
  selectAll: selectAllTokenEntities,
  selectTotal: selectTokenTotal,
  selectById: selectTokenById
} = tokenSelectors;

export function getActiveArtistId(state) {
  return state.usm.activeArtistId;
}

export function getActiveBandId(state) {
  return state.usm.activeBandId;
}

export const selectPlayableSourceByTokenId = createSelector(
  selectTokenById,
  (token) => token.artistDNA // @TODO suport tracks
)

export const selectAllBandEntities = createSelector(
  selectAllTokenEntities,
  (tokens) => tokens.filter((token) => token.tokenType === Constants.usm.tokenType.BAND)
);

export const selectAllArtistEntities = createSelector(
  selectAllTokenEntities,
  (tokens) => tokens.filter((token) => token.tokenType === Constants.usm.tokenType.ARTIST)
);

export const selectAllTrackEntities = createSelector(
  selectAllTokenEntities,
  (tokens) => tokens.filter((token) => token.tokenType === Constants.usm.tokenType.TRACKS)
);

export const selectTokenType = createSelector(
  selectTokenById,
  (token) => token?.tokenType || null
);

export const getBandMembers = createSelector(
  selectTokenById,
  (token) => token?.members
)

export const getNumBandMembers = createSelector(
  selectTokenById,
  (token) => token?.members?.length
)

export const getActiveArtistName = createSelector(
  selectAllArtistEntities,
  getActiveArtistId,
  (artistEntities, artistTokenId) => {
    if (!artistTokenId) {
      return '';
    }

    const artist = artistEntities.find((entity) => entity.tokenId === artistTokenId);
    if (artist) {
      return artist?.name || '';
    }
  }
)

export const getActiveArtistBands = createSelector(
  selectAllBandEntities,
  getActiveArtistId,
  (bands, activeArtistId) => {
    return bands.filter((band) => {
      return band.members.includes(activeArtistId);
    })
  }
)

export function selectOpenTransactions(state) {
  return state.usm.transactions.filter((transaction) => {
    return ![Constants.usm.transactionStatus.MINED, Constants.usm.transactionStatus.FAILED].includes(transaction.status);
  })
}

export const hasOpenTransactions = createSelector(
  selectOpenTransactions,
  (openTransactions) => !!(openTransactions?.length)
);

export function selectOpenTransaction(state, key) {
  const openTransactions = selectOpenTransactions(state);
  return openTransactions.some((transaction) => transaction.key === key);
}

export const isProcessingCreateArtist = createSelector(
  selectOpenTransactions,
  (state, accountAddress) => accountAddress,
  (openTransactions, accountAddress) => {
    const transactionKey = Utils.usm.genCreateArtistTransactionKey(accountAddress);
    return openTransactions.some((transaction) => transaction.key === transactionKey);
  }
)

export const isProcessingStartBand = createSelector(
  selectOpenTransactions,
  (state, artistId) => artistId,
  (openTransactions, artistId) => {
    const transactionKey = Utils.usm.genStartBandTransactionKey(artistId);
    return openTransactions.some((transaction) => transaction.key === transactionKey);
  }
)

export const isProcessingJoinBand = createSelector(
  selectOpenTransactions,
  (state, bandId) => bandId,  
  (state, bandId, artistId) => artistId,  
  (openTransactions, bandId, artistId) => {
    const transactionKey = Utils.usm.genJoinBandTransactionKey(bandId, artistId);
    return openTransactions.some((transaction) => transaction.key === transactionKey);
  }
)

export const isProcessingCreateTrack = createSelector(
  selectOpenTransactions,
  (state, bandId) => bandId,  
  (state, bandId, artistId) => artistId,    
  (openTransactions, bandId, artistId) => {
    const transactionKey = Utils.usm.genCreateTrackTransactionKey(bandId, artistId);
    return openTransactions.some((transaction) => transaction.key === transactionKey);
  }
)
