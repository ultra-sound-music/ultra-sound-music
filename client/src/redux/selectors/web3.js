export function getAccountAddress(state) {
  return state.web3.account
}

export function getNetworkStatus(state) {
  return state.web3.networkStatus;
}

export function getNetworkId(state) {
  return state.web3.networkId;
}

export function isConnected(state) {
  return !!getAccountAddress(state);
}
