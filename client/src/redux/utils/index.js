let store = {}

export function setStore(reduxStore) {
  store = reduxStore;
}

export function getStore() {
  return store;
}