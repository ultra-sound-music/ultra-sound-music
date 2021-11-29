import * as ActionTypes from './actionTypes';
import * as web3Constants from './constants';

export function parseNetworkId(networkId) {
  if (networkId) {
    return parseInt(networkId);
  }
}

export function init(autoConnect) {
  return {
    type: ActionTypes.INIT_WEB3,
    payload: {
      autoConnect
    }
  };
}

export function initWeb3Success({ web3Client }) {
  return {
    type: ActionTypes.INIT_WEB3_SUCCESS,
    payload: {
      web3Client
    }
  };
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

export function processAccountUpdate({ status, account }) {
  return {
    type: ActionTypes.PROCESS_ACCOUNT_UPDATE,
    data: {
      status,
      account
    }
  };
}

export function onProcessAccountUpdate(account) {
  if (account) {
    return processAccountUpdate({
      status: web3Constants.networkStatus.CONNECTED,
      account
    });
  } else {
    return processAccountUpdate({
      status: web3Constants.networkStatus.NOT_CONNECTED
    });
  }
}

export function processNetworkUpdate({ networkId }) {
  return {
    type: ActionTypes.PROCESS_NETWORK_UPDATE,
    data: {
      networkId
    }
  };
}

export function updateNetworkStatus({ status, account, networkId }) {
  return {
    type: ActionTypes.UPDATE_NETWORK_STATUS,
    data: {
      status,
      account,
      networkId
    }
  };
}
