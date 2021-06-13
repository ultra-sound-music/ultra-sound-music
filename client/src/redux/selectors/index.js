import { createSelector } from '@reduxjs/toolkit';
import * as Utils from '../../utils';
import * as tokens from './tokens';
import * as modal from './modal';
import * as web3 from './web3';

export const hasMintedAnArtist = createSelector(
  web3.getAccountAddress,
  tokens.selectAllArtists,
  (accountAddress, artists) => {
    return artists.some((artist) => {
      return Utils.account.areSameAccount(artist.owner, accountAddress);
    });
  }
);

export const hasMintedABand = createSelector(
  web3.getAccountAddress,
  tokens.selectAllBands,
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
  tokens.selectAllBands,
  (accountAddress, bands) => {
    // @todo not sure if owner is the right prop here
    return bands.members.some((band) => {
      return Utils.account.areSameAccount(band.owner, accountAddress);
    });
  }
);

export const tokenIsOwned = createSelector(
  web3.getAccountAddress,
  tokens.selectAllTokens,
  (token, currentAccountId) => {
    return Utils.account.areSameAccount(token.owner, currentAccountId);
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
  tokens,
  modal,
  web3
};
