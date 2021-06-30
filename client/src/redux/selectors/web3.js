import * as Constants from '../../constants';

export function getAccountAddress(state) {
  return state.web3.address
}

export function getNetworkStatus(state) {
  return state.web3.networkStatus;
}

export function getIsInitialized(state) {
  return state.web3.isInitialized;
}

export function isConnected(state) {
  return !!getAccountAddress(state);
}

export function selectOpenTransactions(state) {
  return state.web3.transactions.filter((transaction) => {
    return ![Constants.web3.transactionStatus.MINED, Constants.web3.transactionStatus.FAILED].includes(transaction.status);
  })
}