import { createSelector } from '@reduxjs/toolkit';
import * as Constants from '../../constants';
import tokensAdapter from '../utils/tokensAdapter';

const tokenSelectors = tokensAdapter.getSelectors((state) => state.tokens)

export const {
  selectIds: selectTokenIds, 
  selectEntities: selectTokensEntities,
  selectAll: selectAllTokens,
  selectTotal: selectTokenTotal,
  selectById: selectTokenById
} = tokenSelectors;

export const selectAllBands = createSelector(
  selectAllTokens,
  (tokens) => {
    return tokens.filter((token) => token.type === Constants.entities.tokenTypes.BAND)
  }
);

export const selectAllArtists = createSelector(
  selectAllTokens,
  (tokens) => tokens.filter((token) => token.type === Constants.entities.tokenTypes.ARTIST)
);

export const selectAllTracks = createSelector(
  selectAllTokens,
  (tokens) => tokens.filter((token) => token.type === Constants.entities.tokenTypes.TRACKS)
);