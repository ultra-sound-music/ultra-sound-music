import { createSelector } from '@reduxjs/toolkit';
import * as Constants from '../../constants';
import * as Utils from '../../utils';
import * as playback from './playback';
import * as usm from './usm';
import * as modal from './modal';
import * as web3 from './web3';

export const getOwnedTokens = createSelector(
  web3.getAccountAddress,
  usm.selectAllTokenEntities,
  (accountAddress, tokenEntities) => {
    return tokenEntities.filter((token) => {
      return token.owner === accountAddress;      
    });
  }
)

export const getOwnedArtists = createSelector(
  getOwnedTokens,
  (tokens) => tokens.filter((token) => token.tokenType === 'artist')
);

export const isOwnedToken = createSelector(
  web3.getAccountAddress,
  usm.selectTokenById,
  (accountAddress, { owner }) => accountAddress === owner
)

export const getBandsWithPublishedTracks = createSelector(
  web3.getAccountAddress,
  usm.selectAllBandEntities,
  () => []
)

export const getPlayingTokenId = createSelector(
  playback.selectActiveSource,
  () => {
    return 123
  }
)

export const getActiveArtist = createSelector(
  usm.getActiveArtist,
  getOwnedArtists,
  (activeArtist, ownedArtists) => {
    return activeArtist || ownedArtists[0];
  }
)

export const getActiveArtistId = createSelector(
  getActiveArtist,
  (artist) => artist?.tokenId ?? null
)

export const isMemberOfBand = createSelector(
  usm.selectTokenById,
  getActiveArtistId,
  (token, activeArtistId) => token.tokenType === 'band' && token?.members.some((member) => member.artistId === activeArtistId)
);

export const canJoinBand = createSelector(
  isMemberOfBand,
  usm.getNumBandMembers,
  (isMemberOfBand, numBandMembers) => {
    return !isMemberOfBand && (numBandMembers < Constants.usm.MAX_BAND_MEMBERS)
  }
)

// @TODO - Still need to sort out how to manage permissions to join a band
export const canRequestToJoinBand = canJoinBand;

export const canInviteBandMembers = createSelector(
  isMemberOfBand,
  usm.getNumBandMembers,
  (isMemberOfBand, numBandMembers) => isMemberOfBand && (numBandMembers < Constants.usm.MAX_BAND_MEMBERS)  
)

/// OLD

export const hasMintedAnArtist = createSelector(
  web3.getAccountAddress,
  usm.selectAllArtistEntities,
  (accountAddress, artists) => {
    return artists.some((artist) => {
      return Utils.account.areSameAccount(artist.owner, accountAddress);
    });
  }
);

export const hasMintedABand = createSelector(
  web3.getAccountAddress,
  usm.selectAllBandEntities,
  (accountAddress, bands) => {
    return bands.some((band) => {
      return Utils.account.areSameAccount(band.owner, accountAddress);
    });
  }
);

export const hasMintedATrack = createSelector(
  web3.getAccountAddress,
  () => {
    return ''; // @TODO
  }
)

export const tokenIsOwned = createSelector(
  web3.getAccountAddress,
  usm.selectAllTokenEntities,
  (accountAddress, tokenEntities) => {
    return tokenEntities.some((token) => Utils.account.areSameAccount(token.owner, accountAddress));
  }
)

// @TODO Update these...

export function hasAlreadyPublishedTrack(token, currentAccountId) {
  // @todo 
  return token.tokenType === 'band' && Utils.account.areSameAccount(token.metadata.artistDNA, currentAccountId);
}

export {
  playback,
  usm,
  modal,
  web3
};
