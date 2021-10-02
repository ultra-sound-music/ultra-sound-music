import { createSelector } from '@reduxjs/toolkit';
import constants from '@constants';
import * as Utils from '../../utils';
import { tokensAdapter } from '../utils/tokensAdapter';

import mixcoatl from '@images/mock/mixcoatl.png';

const tokenSelectors = tokensAdapter.getSelectors((state) => state.usm);

export const {
  selectIds: selectEntityIds,
  selectEntities: selectTokenEntities,
  selectAll: selectAllTokenEntities,
  selectTotal: selectTokenTotal,
  selectById: selectTokenById
} = tokenSelectors;

export function getUsmState(state) {
  return state.usm;
}

export function getActiveArtistId(state) {
  return state.usm.activeArtistId;
}

export function getActiveBandId(state) {
  return state.usm.activeBandId;
}

export function getIsProcessingTransaction(state) {
  return state.usm.isProcessingTransaction;
}

export function getAllNewMints(state) {
  return state.usm.newMints;
}

export const selectAllArtistEntities = createSelector(
  selectAllTokenEntities,
  (tokens) =>
    tokens.filter((token) => token.tokenType === constants.usm.tokenType.ARTIST)
);

export const getActiveArtist = createSelector(
  getActiveArtistId,
  selectAllArtistEntities,
  (artistId, artists) => artists.find((artist) => artist._id === artistId)
);

export const selectAllBandEntities = createSelector(
  selectAllTokenEntities,
  (tokens) =>
    tokens.filter((token) => token.tokenType === constants.usm.tokenType.BAND)
);

export const getActiveBand = createSelector(
  getActiveArtistId,
  selectAllBandEntities,
  (bandId, bands) => bands.find((band) => band._id === bandId)
);

export const getActiveArtistTid = createSelector(
  getActiveArtist,
  (artist) => artist?.tokenId ?? ''
);

export const getActiveArtistName = createSelector(
  getActiveArtist,
  (artist) => artist?.name ?? ''
);

export const getActiveArtistTraits = () => {
  return {
    texture: 3,
    warmth: 2,
    dissonance: 3,
    aggression: 1,
    space: 4
  };
};

export const getActiveArtistImageUrl = () => {
  return mixcoatl;
};

export const getActiveArtistBands = createSelector(
  getActiveArtistTid,
  selectAllBandEntities,
  (activeArtistTid, bands) => {
    return bands.filter((band) => {
      return band.members.includes(activeArtistTid);
    });
  }
);

export const getActiveBandTid = createSelector(
  getActiveBand,
  (band) => band?.tokenId ?? ''
);

export const getActiveBandName = createSelector(
  getActiveBand,
  (band) => band?.name ?? ''
);

export const getTokenId = createSelector(
  selectTokenById,
  (token) => token?.tokenId ?? null
);

export const selectAllTrackEntities = createSelector(
  selectAllTokenEntities,
  (tokens) =>
    tokens.filter((token) => token.tokenType === constants.usm.tokenType.TRACK)
);

export const getTokenType = createSelector(
  selectTokenById,
  (token) => token?.tokenType || null
);

export const getBandMemberTids = createSelector(
  selectTokenById,
  (band) => band?.members
);

export const getBandMembers = createSelector(
  getBandMemberTids,
  selectAllArtistEntities,
  (artistTids, artists) => {
    return artists.filter((artist) => {
      return artistTids.includes(artist?.tokenId);
    });
  }
);

export const getBandMemberIds = createSelector(getBandMembers, (artists) =>
  artists.map((artist) => artist._id)
);

export const getNumBandMembers = createSelector(
  selectTokenById,
  (token) => token?.members?.length
);

export const getTokenName = createSelector(
  selectTokenById,
  (token) => token?.name
);

export const selectAllTransactions = createSelector(
  getUsmState,
  (usmState) => usmState.transactions
);

export const getTransactionStatusByType = createSelector(
  selectAllTransactions,
  (state, { type, artistTid, bandTid }) =>
    Utils.usm.genTransactionKeyByType(type, artistTid, bandTid),
  (transactions, transactionKey) => {
    const tx = transactions.find(
      (transaction) => transaction.key === transactionKey
    );
    return tx?.status ?? '';
  }
);

export const selectCompletedTransactions = createSelector(
  selectAllTransactions,
  (transactions) =>
    transactions.filter((transaction) => {
      return [
        constants.usm.transactionStatus.MINED,
        constants.usm.transactionStatus.FAILED
      ].includes(transaction.status);
    })
);

export const hasTransactionCompleted = createSelector(
  selectCompletedTransactions,
  ({ transactionId, key }) => {
    transactionId, key;
  },
  (transactions, { transactionId, key }) =>
    transactions.some((tx) => {
      tx.key === key || tx.transactionId === transactionId;
    })
);

export const selectOpenTransactions = createSelector(
  selectAllTransactions,
  (transactions) =>
    transactions.filter((transaction) => {
      return ![
        constants.usm.transactionStatus.MINED,
        constants.usm.transactionStatus.FAILED
      ].includes(transaction.status);
    })
);

export const selectOpenTransaction = createSelector(
  selectOpenTransactions,
  ({ key, transactionId }) => {
    key, transactionId;
  },
  (transactions, { key, transactionId }) =>
    transactions.find(
      (transaction) =>
        transaction.key === key || transaction.transactionId === transactionId
    )
);

export const hasOpenTransactions = createSelector(
  selectOpenTransactions,
  (openTransactions) => !!openTransactions?.length
);

export const isOpenTransaction = createSelector(
  selectOpenTransaction,
  (openTransaction) => !!openTransaction
);

export const isProcessingCreateArtist = createSelector(
  selectOpenTransactions,
  (state, accountAddress) => accountAddress,
  (openTransactions, accountAddress) => {
    const transactionKey =
      Utils.usm.genCreateArtistTransactionKey(accountAddress);
    return openTransactions.some(
      (transaction) => transaction.key === transactionKey
    );
  }
);

export const isProcessingStartBand = createSelector(
  selectOpenTransactions,
  (state, artistId) => artistId,
  (openTransactions, artistId) => {
    const transactionKey = Utils.usm.genStartBandTransactionKey(artistId);
    return openTransactions.some(
      (transaction) => transaction.key === transactionKey
    );
  }
);

export const isProcessingJoinBand = createSelector(
  selectOpenTransactions,
  (state, bandId) => bandId,
  (state, bandId, artistId) => artistId,
  (openTransactions, bandId, artistId) => {
    const transactionKey = Utils.usm.genJoinBandTransactionKey(
      bandId,
      artistId
    );
    return openTransactions.some(
      (transaction) => transaction.key === transactionKey
    );
  }
);

export const isProcessingCreateTrack = createSelector(
  selectOpenTransactions,
  (state, bandId) => bandId,
  (state, bandId, artistId) => artistId,
  (openTransactions, bandId, artistId) => {
    const transactionKey = Utils.usm.genCreateTrackTransactionKey(
      bandId,
      artistId
    );
    return openTransactions.some(
      (transaction) => transaction.key === transactionKey
    );
  }
);

export function isProcessingTransaction(state) {
  return state.usm.isProcessingTransaction;
}

export const getBandTidByTrackId = createSelector(selectTokenById, (track) => {
  if (track?.tokenType === constants.usm.tokenType.TRACK) {
    return track.band;
  }
});

export const getBandByTrackId = createSelector(
  getBandTidByTrackId,
  selectAllBandEntities,
  (bandTid, bands) => {
    return bands.find((band) => {
      return band.tokenId === bandTid;
    });
  }
);

export const getBand = createSelector(selectTokenById, (band) =>
  band.tokenType === constants.usm.tokenType.BAND ? band : null
);

export const getBandName = createSelector(getBand, ({ name }) => name);

export const getBandTraits = createSelector(getBand, () => ({
  texture: 3,
  warmth: 2,
  dissonance: 3,
  aggression: 1,
  space: 4
}));

export const getTrackCreatorByTrackId = createSelector(
  selectTokenById,
  (track) => {
    if (track?.tokenType === constants.usm.tokenType.TRACK) {
      return track.creator;
    }
  }
);

export const getAllTracksByBandId = createSelector(
  getTokenId,
  selectAllTrackEntities,
  (bandTid, tracks) => {
    return tracks?.filter((track) => track.band === bandTid);
  }
);

export const hasActiveArtistMintedATrackForBand = createSelector(
  getActiveArtistTid,
  getAllTracksByBandId,
  (artistTid, tracks) => {
    return tracks.some((track) => track.creator === artistTid);
  }
);

export const canActiveArtistCreateTrackForBand = createSelector(
  hasActiveArtistMintedATrackForBand,
  (hasMintedATrackForBand) => !hasMintedATrackForBand
);

export const getBandLeaderTokenIdByTrackId = createSelector(
  getBandByTrackId,
  (band) => band?.creator
);

export const getTrackCreatorTokenIdByTrackId = createSelector(
  selectTokenById,
  (track) =>
    track?.tokenType === constants.usm.tokenType.TRACK ? track?.creator : void 0
);

export const getBandMemberTokenIdsByTrackId = createSelector(
  getBandByTrackId,
  (band) => band?.members
);

export const getTrackDNA = createSelector(
  getBandMemberTokenIdsByTrackId,
  getBandLeaderTokenIdByTrackId,
  getTrackCreatorTokenIdByTrackId,
  selectAllArtistEntities,
  (artistTids, bandLeaderTid, trackCreatorTid, artists) => {
    if (!Array.isArray(artistTids)) {
      return;
    }

    let bandLeaderDNA;
    let trackCreatorDNA;

    const rawDNAs = artistTids.map((artistTid) => {
      const bandMember = artists.find(({ tokenId, artistDNA }) => {
        if (tokenId === bandLeaderTid) bandLeaderDNA = artistDNA;
        if (tokenId === trackCreatorTid) trackCreatorDNA = artistDNA;
        return tokenId === artistTid ?? artistDNA;
      });

      return bandMember?.artistDNA;
    });

    return [...rawDNAs, bandLeaderDNA, trackCreatorDNA, trackCreatorDNA];
  }
);

export const selectPlayableSourceById = createSelector(
  selectTokenById,
  getTrackDNA,
  ({ artistDNA, tokenType }, trackDNA) => {
    switch (tokenType) {
      case constants.usm.tokenType.ARTIST: {
        return artistDNA;
      }
      case constants.usm.tokenType.TRACK: {
        return trackDNA;
      }
    }
  }
);

export const isMemberOfBand = createSelector(
  selectTokenById,
  getActiveArtistTid,
  (token, activeArtistTid) =>
    token.tokenType === 'band' &&
    token?.members.some((artistTid) => artistTid === activeArtistTid)
);

export const canCreateTrackForBand = createSelector(
  isMemberOfBand,
  getNumBandMembers,
  hasActiveArtistMintedATrackForBand,
  (isMemberOfBand, numBandMembers, hasMintedATrackForBand) => {
    return (
      isMemberOfBand &&
      numBandMembers > constants.usm.MIN_BAND_MEMBERS &&
      !hasMintedATrackForBand
    );
  }
);

export const canJoinBand = createSelector(
  isMemberOfBand,
  getNumBandMembers,
  (isMemberOfBand, numBandMembers) => {
    return !isMemberOfBand && numBandMembers < constants.usm.MAX_BAND_MEMBERS;
  }
);

export const getSuggestedBandName = (state) => {
  return state.usm.suggestedBandName;
};

// @TODO - Still need to sort out how to manage permissions to join a band
export const canRequestToJoinBand = canJoinBand;

export const canInviteBandMembers = createSelector(
  isMemberOfBand,
  getNumBandMembers,
  (isMemberOfBand, numBandMembers) =>
    isMemberOfBand && numBandMembers < constants.usm.MAX_BAND_MEMBERS
);
