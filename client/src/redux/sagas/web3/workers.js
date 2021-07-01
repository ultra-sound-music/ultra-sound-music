import { select, call, fork, put } from 'redux-saga/effects'
import EthClient from '../../../lib/EthClient';
import * as Constants from '../../../constants';
import * as Actions from '../../actions';
import * as Selectors from '../../selectors';
import * as Helpers from './helpers';

let ethClient;

export function* init() {
  ethClient = new EthClient({ethereum: window.ethereum});

  const isInitialized = yield select(Selectors.web3.getIsInitialized);
  if (isInitialized) {
    return; // @TODO clear out old event bindings and allow saga to re-init
  }

  const connectedAccount = yield call(ethClient.initialize);
  if (yield call(ethClient.getIsWeb3sAvailable)) {
    yield fork(Helpers.startWatchingForEthereumEvents, ethClient.ethereum);
  }

  if (connectedAccount) {
    const chainId = yield call(ethClient.getChainId);
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
    yield call(ethClient.connectWallet);
  } catch (error) {
    yield put(Actions.web3.updateNetworkStatus(Constants.web3.networkStatus.NOT_CONNECTED));
    
    let bodyText;
    if (error.code === -32002) {
      bodyText = 'There was an error connecting to MetaMask. Please try connecting manually to MetaMask by clicking on the MetaMask wallet.';
    } else {
      bodyText = error;
    }

    const modalProps = {
      title: 'Failed to connect',
      bodyText
    };
    yield put(Actions.ui.showModal(modalProps));
  }
}
