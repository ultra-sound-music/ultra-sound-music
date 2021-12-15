import { createSelector } from '@reduxjs/toolkit';

import utils from '@utils';
import playback from '@usm/store/playback';
import usm from '@usm/store/usm';
import ui from '@usm/store/ui';
import web3 from '@usm/store/web3';

export const getOwnedTokens = createSelector(
  web3.selectors.getAccountAddress,
  usm.selectors.selectAllTokenEntities,
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
  web3.selectors.getAccountAddress,
  usm.selectors.selectTokenById,
  (accountAddress, { owner }) => accountAddress === owner
);

export const getBandsWithPublishedTracks = createSelector(
  web3.selectors.getAccountAddress,
  usm.selectors.selectAllBandEntities,
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
  web3.selectors.getAccountAddress,
  usm.selectors.selectAllBandEntities,
  (accountAddress, bands) => {
    return bands.some((band) => {
      return utils.areSameAccount(band.owner, accountAddress);
    });
  }
);

/// OLD

export const hasMintedATrack = createSelector(
  web3.selectors.getAccountAddress,
  () => {
    return ''; // @TODO
  }
);

export const tokenIsOwned = createSelector(
  web3.selectors.getAccountAddress,
  usm.selectors.selectAllTokenEntities,
  (accountAddress, tokenEntities) => {
    return tokenEntities.some((token) =>
      utils.areSameAccount(token.owner, accountAddress)
    );
  }
);

// @TODO Update these...

export function hasAlreadyPublishedTrack(token, currentAccountId) {
  // @todo
  return (
    token.tokenType === 'band' &&
    utils.areSameAccount(token.metadata.artistDNA, currentAccountId)
  );
}

export { playback, usm, ui, web3 };
