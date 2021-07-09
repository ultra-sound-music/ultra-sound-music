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

export const getTokenName = createSelector(
  selectTokenById,
  (token) => token?.name
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

export const getActiveBandName = createSelector(
  selectAllBandEntities,
  getActiveBandId,
  (bands, bandId) => {
    const band = bands.find((band) => band.tokenId === bandId)
    return band?.name;
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

export function hasOpenTransaction(state, key) {
  return !!(selectOpenTransaction(state, key));
}

export const getBandByTrackId = createSelector(
  selectTokenById,
  selectAllBandEntities,
  (track, bands) => {
    const bandId = (track?.tokenType === Constants.usm.tokenType.TRACK) && track.band;
    return bands.find((band) => {
      return band.tokenId === bandId
    });
  }
);

export const getTrackCreatorByTrackId = createSelector(
  selectTokenById,
  (track) => {
    if (track?.tokenType === Constants.usm.tokenType.TRACK) {
      return track.creator;
    }
  }
)

export const getAllTracksByBandId = createSelector(
  (state, bandId) => bandId, 
  selectAllTrackEntities,
  (bandId, tracks) => tracks?.filter((track) => track.band === bandId)
)

export const hasActiveArtistMintedATrackForBand = createSelector(
  getActiveArtistId,
  getAllTracksByBandId,
  (artistId, tracks) => tracks.some((track) => track.artist === artistId)
)

export const canActiveArtistCreateTrackForBand = createSelector(
  hasActiveArtistMintedATrackForBand,
  (hasCreated) => !hasCreated
)

export const getBandLeaderIdByTrackId = createSelector(
  getBandByTrackId,
  (band) => band?.creator
)

export const getTrackCreatorIdByTrackId = createSelector(
  selectTokenById,
  (track) => (track?.tokenType === Constants.usm.tokenType.TRACK) ? track?.creator : void 0
)

export const getBandMembersByTrackId = createSelector(
  getBandByTrackId,
  (band) => band?.members
)

export const getTrackDNA = createSelector(
  getBandMembersByTrackId,
  getBandLeaderIdByTrackId,
  getTrackCreatorIdByTrackId,
  selectAllArtistEntities,
  (artistIds, bandLeaderId, trackCreatorId, artists) => {
    if (!Array.isArray(artistIds)) {
      return;
    }

    let bandLeaderDNA;
    let trackCreatorDNA;

    const rawDNAs = artistIds.map((artistId) => {
      const bandMember = artists.find(({ tokenId, artistDNA }) => {
        if (tokenId === bandLeaderId) bandLeaderDNA = artistDNA
        if (tokenId === trackCreatorId) trackCreatorDNA = artistDNA
        return tokenId === artistId ?? artistDNA
      });

      return bandMember?.artistDNA;
    });
    
    return [...rawDNAs, bandLeaderDNA, trackCreatorDNA, trackCreatorDNA];
  }
);

export const selectPlayableSourceByTokenId = createSelector(
  selectTokenById,
  getTrackDNA,
  ({ artistDNA, tokenType }, trackDNA) => {
    switch(tokenType) {
      case Constants.usm.tokenType.ARTIST: {
        return artistDNA
      }
      case Constants.usm.tokenType.TRACK: {
        return trackDNA
      }            
    }
  }
)
