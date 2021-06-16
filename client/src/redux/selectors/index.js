import { createSelector } from '@reduxjs/toolkit';
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

export const getBandsWithPublishedTracks = createSelector(
  web3.getAccountAddress,
  usm.selectAllBandEntities,
  (accountAddress, bands) => []
)

export const getPlayingTokenId = createSelector(
  playback.selectActiveSource,
  (address) => {
    return 123
  }
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

export const isMemberOfBand = createSelector(
  web3.getAccountAddress,
  usm.selectAllBandEntities,
  (accountAddress, bands) => {
    // @todo not sure if owner is the right prop here
    return bands.members.some((band) => {
      return Utils.account.areSameAccount(band.owner, accountAddress);
    });
  }
);

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

export function getOwnedArtists(tokens, currentAccountId) {
  return tokens.filter((token) => {
    return token.tokenType === 'artist' && Utils.account.areSameAccount(token.owner, currentAccountId);
  })
}


export {
  playback,
  usm,
  modal,
  web3
};
