import * as ActionTypes from '../actionTypes';

export function init() {
  return {
    type: ActionTypes.INIT_WEB3
  }
}

export function initWeb3Success() {
  return {
    type: ActionTypes.INIT_WEB3_SUCCESS
  }
}

export function installWallet() {
  return {
    type: ActionTypes.INSTALL_WALLET
  };
}

export function connectWallet() {
  return {
    type: ActionTypes.CONNECT_WALLET
  };
}

export function updateNetworkStatus(status, address, chainId) {
  return {
    type: ActionTypes.UPDATE_NETWORK_STATUS,
    data: {
      status,
      address,
      chainId
    }
  }
}

export function updateNetworkChain(chainId) {
  return {
    type: ActionTypes.UPDATE_NETWORK_CHAIN,
    data: {
      chainId
    }
  }
}

export function setTransaction(transactionId) {
  return {
    type: ActionTypes.SET_TRANSACTION,
    data: {
      transactionId
    }
  }
}