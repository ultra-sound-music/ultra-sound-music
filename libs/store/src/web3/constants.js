export const networkStatus = Object.freeze({
  NOT_AVAILABLE: 'NOT_AVAILABLE', // Has wallet but not connected to network
  INSTALLING: 'INSTALLING',
  NOT_CONNECTED: 'NOT_CONNECTED', // Has wallet but not connected to USM
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  PROCESSING_TRANSACTION: 'PROCESSING_TRANSACTION',
});
