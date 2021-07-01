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

export function bindCoreEventListeners(emitter, ethereum, listeners) {
  return Object.keys(listeners).reduce((boundEventListeners, eventName) => {
    const handler = (...args) => {
      const getAction = listeners[eventName];
      const action = getAction(...args);
      emitter(action)
    };
    ethereum.on(eventName, handler);
    boundEventListeners[eventName] = handler;
    return boundEventListeners;
  }, {});
}

export function removeCoreEventListeners(ethereum, listeners) {
  Object.keys(listeners).forEach((eventName) => {
    ethereum.removeListener(eventName, listeners[eventName]);
  });
}