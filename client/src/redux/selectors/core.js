import { createSelector } from '@reduxjs/toolkit';

import * as Utils from '../../utils';
import * as playback from './playback';
import * as usm from './usm';
import * as ui from './ui';
import * as web3 from './web3';

export const getOwnedTokens = createSelector(
  web3.getAccountAddress,
  usm.selectAllTokenEntities,
  (accountAddress, tokenEntities) => {
    return tokenEntities.filter((token) => {
      return token.owner === accountAddress;
    });
  }
);

export const getOwnedArtists = createSelector(getOwnedTokens, (tokens) =>
  tokens.filter((token) => token.tokenType === 'artist')
);

export const getOwnedBands = createSelector(getOwnedTokens, (tokens) =>
  tokens.filter((token) => token.tokenType === 'band')
);

export const isOwnedToken = createSelector(
  web3.getAccountAddress,
  usm.selectTokenById,
  (accountAddress, { owner }) => accountAddress === owner
);

export const getBandsWithPublishedTracks = createSelector(
  web3.getAccountAddress,
  usm.selectAllBandEntities,
  () => []
);

export const ownsAnArtist = createSelector(
  getOwnedArtists,
  (artists) => artists?.length > 0
);

export const ownsABand = createSelector(
  getOwnedBands,
  (bands) => bands?.length > 0
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

/// OLD

export const hasMintedATrack = createSelector(web3.getAccountAddress, () => {
  return ''; // @TODO
});

export const tokenIsOwned = createSelector(
  web3.getAccountAddress,
  usm.selectAllTokenEntities,
  (accountAddress, tokenEntities) => {
    return tokenEntities.some((token) =>
      Utils.account.areSameAccount(token.owner, accountAddress)
    );
  }
);

// @TODO Update these...

export function hasAlreadyPublishedTrack(token, currentAccountId) {
  // @todo
  return (
    token.tokenType === 'band' &&
    Utils.account.areSameAccount(token.metadata.artistDNA, currentAccountId)
  );
}

export { playback, usm, ui, web3 };
