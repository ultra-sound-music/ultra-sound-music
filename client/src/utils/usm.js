export function genCreateArtistTransactionKey(accountAddress) {
  return `${accountAddress}-creates-arstist`;
}

export function genStartBandTransactionKey(artistId) {
  return `${artistId}-starts-band`;
}

export function genJoinBandTransactionKey(bandId, artistId) {
  return `${artistId}-joins-${bandId}`;
}

export function genCreateTrackTransactionKey(bandId, artistId) {
  return `${bandId}-${artistId}-creates-track`;
}