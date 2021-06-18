import { select, call, fork, put } from 'redux-saga/effects'
import * as Utils from '../../../utils';
import * as Constants from '../../../constants';
import * as Actions from '../../actions';
import * as Selectors from '../../selectors';
import * as Helpers from './helpers';

export function* init() {
  const isInitialized = yield select(Selectors.web3.getIsInitialized);
  if (isInitialized) {
    return; // @TODO clear out old event bindings and allow saga to re-init
  }

  const connectedAccount = yield call(Utils.web3.initialize);
  if (yield call(Utils.web3.getIsWeb3sAvailable)) {
    yield fork(Helpers.startWatchingForEthereumEvents);
  }

  if (connectedAccount) {
    const chainId = yield call(Utils.web3.getChainId);
    yield put(Actions.web3.updateNetworkStatus(Constants.web3.networkStatus.CONNECTED, connectedAccount, chainId));
  }

  yield put(Actions.web3.initWeb3Success());
}

export function* installWallet() {
  // @TODO
}

export function* connectWallet() {
  try {
    yield put(Actions.web3.updateNetworkStatus(Constants.web3.networkStatus.CONNECTING));
    yield call(Utils.web3.connectWallet);
  } catch (error) {
    yield put(Actions.web3.updateNetworkStatus(Constants.web3.networkStatus.NOT_CONNECTED));
    const modalProps = {
      title: 'Failed to connect',
      body: error,
      ctaText: 'close'
    };
    yield put(Actions.ui.showModal(modalProps));
  }
}
