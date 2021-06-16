export const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export const networkStatus = Object.freeze({
  NOT_AVAILABLE: 'NOT_AVAILABLE',
  INSTALLING: 'INSTALLING',
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  PROCESSING_TRANSACTION: 'PROCESSING_TRANSACTION'
});

export const transactionStatus = Object.freeze({
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  MINED: 'MINED',
  FAILED: 'FAILED'
});

export const transactionErrorCodes = Object.freeze({
  
});

export const providerEventNames = Object.freeze({
  ACCOUNTS_CHANGED: 'accountsChanged',
  CHAIN_CHANGED: 'chainChanged'
}); 