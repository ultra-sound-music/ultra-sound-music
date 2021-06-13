export function hasAlreadyPublishedTrack(entity, currentAccountId) {
  // @todo 
  return entity.tokenType === 'band' && areSameAccount(entity.metadata.artistDNA, currentAccountId);
}

export function getOwnedArtists(entities, currentAccountId) {
  return entities.filter((entity) => {
    return entity.tokenType === 'artist' && areSameAccount(entity.owner, currentAccountId);
  })
}

export function entityIsOwned(entity, currentAccountId) {
  return areSameAccount(entity.owner, currentAccountId);
}

export function isMember(entity, currentAccountId) {
  // @todo not sure if owner is the right prop here
  return entity.tokenType === 'band' && entity.members.some((artist) => {
    return areSameAccount(artist.owner, currentAccountId);
  });
}

// Account addresses can have different casing
// @Todo - Can we avoid needing this function if we lowercase all accountIds before saving them to the store?
export function areSameAccount(...accId) {
  const hasEmptyVal = (!accId) || accId.some(accountId => !accountId);
  if (hasEmptyVal) {
    return false;
  }
  return accId.every(accountId => accountId.toLowerCase() === accId[0].toLowerCase());
}