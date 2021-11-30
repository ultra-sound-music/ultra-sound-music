import * as actions from '../../actions';
import * as web3Utils from '../helpers';

import * as ethereumConstants from './constants';

export const coreEventListeners = {
  [ethereumConstants.providerEventNames.ACCOUNTS_CHANGED]: onAccountsChanged,
  [ethereumConstants.providerEventNames.CHAIN_CHANGED]: onChainChanged
};

export function* startWatchingForEthereumEvents(ethClient) {
  return yield web3Utils.startWatchingForWalletEvents(
    ethClient,
    coreEventListeners,
    [ethClient]
  );
}

export function onAccountsChanged(solClient) {
  const address = solClient.wallet.publicKey?.toString();
  return actions.onProcessAccountUpdate(address);
}

export function onChainChanged(chainId) {
  return actions.processNetworkUpdate({ networkId: parseInt(chainId) });
}
