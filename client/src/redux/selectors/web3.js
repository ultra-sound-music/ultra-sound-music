export function getAccountAddress(state) {
  return state.web3.address
}

export function getNetworkStatus(state) {
  return state.web3.networkStatus;
}

export function getIsInitialized(state) {
  return state.web3.isInitialized;
}
