export function bindCoreEventListeners(emitter, obj, listeners) {
  return Object.keys(listeners).reduce((boundEventListeners, eventName) => {
    const handler = (...args) => {
      const getAction = listeners[eventName];
      const action = getAction(...args);
      emitter(action);
    };
    obj.on(eventName, handler);
    boundEventListeners[eventName] = handler;
    return boundEventListeners;
  }, {});
}

export function removeCoreEventListeners(obj, listeners) {
  Object.keys(listeners).forEach((eventName) => {
    obj.removeListener(eventName, listeners[eventName]);
  });
}
