export function bindCoreEventListeners(
  emitter,
  web3Client,
  eventListeners,
  extraArgs
) {
  return Object.keys(eventListeners).reduce((boundListeners, eventName) => {
    const handler = (...args) => {
      const getAction = eventListeners[eventName];
      const action = getAction(...args, ...extraArgs);
      emitter(action);
    };
    web3Client.on(eventName, handler);
    boundListeners[eventName] = handler;
    return boundListeners;
  }, {});
}

export function removeCoreEventListeners(web3Client, listeners) {
  Object.keys(listeners).forEach((eventName) => {
    web3Client.off(eventName, listeners[eventName]);
  });
}
