import { createSelector } from 'reselect'
import * as Utils from '../../utils';
import * as entities from './entities';
import * as modal from './modal';
import * as web3 from './web3';

export const hasMintedAnArtist = createSelector(
  web3.getAccountAddress,
  entities.getArtists,
  (accountAddress, artists) => {
    return artists.some((artist) => {
      return Utils.account.areSameAccount(artist.owner, accountAddress);
    });
  }
);

export const hasMintedABand = createSelector(
  web3.getAccountAddress,
  entities.getBands,
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
  entities.getBands,
  (accountAddress, bands) => {
    // @todo not sure if owner is the right prop here
    return bands.members.some((band) => {
      return Utils.account.areSameAccount(band.owner, accountAddress);
    });
  }
);

export const entityIsOwned = createSelector(
  web3.getAccountAddress,
  entities.getEntities,
  (entity, currentAccountId) => {
    return Utils.account.areSameAccount(entity.owner, currentAccountId);
  }
)

// @TODO Update these...

export function hasAlreadyPublishedTrack(entity, currentAccountId) {
  // @todo 
  return entity.tokenType === 'band' && Utils.account.areSameAccount(entity.metadata.artistDNA, currentAccountId);
}

export function getOwnedArtists(entities, currentAccountId) {
  return entities.filter((entity) => {
    return entity.tokenType === 'artist' && Utils.account.areSameAccount(entity.owner, currentAccountId);
  })
}


export {
  entities,
  modal,
  web3
};
