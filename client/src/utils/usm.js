export const map = {
  'create-artist': genCreateArtistTransactionKey,
  'start-band': genStartBandTransactionKey,
  'join-band': genJoinBandTransactionKey,
  'create-track': genCreateTrackTransactionKey
};

export function genCreateArtistTransactionKey(accountAddress) {
  return `${accountAddress}-creates-arstist`;
}

export function genStartBandTransactionKey(artistTid) {
  return `${artistTid}-starts-band`;
}

export function genJoinBandTransactionKey(bandTid, artistTid) {
  return `${artistTid}-joins-${bandTid}`;
}

export function genCreateTrackTransactionKey(bandTid, artistTid) {
  return `${bandTid}-${artistTid}-creates-track`;
}

export function genTransactionKeyByType(type, artistTid, bandTid) {
  return map[type](artistTid, bandTid);
}
