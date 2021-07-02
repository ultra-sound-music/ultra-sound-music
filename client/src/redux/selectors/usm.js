import { createSelector } from '@reduxjs/toolkit';
import * as Constants from '../../constants';
import tokensAdapter from '../utils/tokensAdapter';

const tokenSelectors = tokensAdapter.getSelectors((state) => state.usm)

export const {
  selectIds: selectTokenIds, 
  selectEntities: selectTokenEntities,
  selectAll: selectAllTokenEntities,
  selectTotal: selectTokenTotal,
  selectById: selectTokenById
} = tokenSelectors;

export function getActiveArtist(state) {
  return state.usm.activeArtist;
}

export const selectPlayableSourceByTokenId = createSelector(
  selectTokenById,
  (token) => token.metadata.artistDNA // @TODO suport tracks
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
  getActiveArtist,
  (artistEntities, artistTokenId) => {
    if (!artistTokenId) {
      return '';
    }

    const artist = artistEntities.find((entity) => entity.tokenId === artistTokenId);
    if (artist) {
      return artist?.metadata?.name || '';
    }
  }
)

export const getActiveArtistId = createSelector(
  selectAllArtistEntities,
  getActiveArtist,
  (artistEntities, artistTokenId) => {
    if (!artistTokenId) {
      return null;
    }

    const artist = artistEntities.find((entity) => entity.tokenId === artistTokenId);
    if (artist) {
      // @TODO - temporarily typecasting to number since the blockchain is currently inconsistent with this
      return artist?.tokenId || null;
    }
  }
)