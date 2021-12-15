import * as actions from '../../actions';

import * as solanaConstants from './constants';

export const coreEventListeners = {
  [solanaConstants.CONNECT]: onAccountsChanged,
  [solanaConstants.DISCONNECT]: onAccountsChanged,
};

export function onAccountsChanged(solClient) {
  const address = solClient.wallet.publicKey?.toString();
  return actions.onProcessAccountUpdate(address);
}

export function onChainChanged(chainId) {
  return actions.processNetworkUpdate({ networkId: parseInt(chainId) });
}
