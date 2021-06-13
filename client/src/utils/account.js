// Account addresses can have different casing
// @Todo - Can we avoid needing this function if we lowercase all accountIds before saving them to the store?
export function areSameAccount(...accId) {
  const hasEmptyVal = (!accId) || accId.some(accountId => !accountId);
  if (hasEmptyVal) {
    return false;
  }
  return accId.every(accountId => accountId.toLowerCase() === accId[0].toLowerCase());
}