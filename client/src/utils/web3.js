export function bindCoreEventListeners(emitter, ethereum, listeners) {
  return Object.keys(listeners).reduce((boundEventListeners, eventName) => {
    const handler = (...args) => {
      const getAction = listeners[eventName];
      const action = getAction(...args);
      emitter(action);
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
