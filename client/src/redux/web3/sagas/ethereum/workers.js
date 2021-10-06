import { call, fork, put } from 'redux-saga/effects';
import EthClient from '@lib/EthClient';
import mediator from '@store/mediator';
import * as web3Constants from '../../constants';
import * as web3Actions from '../../actions';
import * as helpers from './helpers';

let ethClient;

export function* init() {
  ethClient = new EthClient({ ethereum: window.ethereum });
  const connectedAccount = yield call([ethClient, 'init']);
  if (ethClient.isWeb3Available) {
    yield fork(helpers.startWatchingForEthereumEvents, ethClient.ethereum);
  }

  if (connectedAccount) {
    const chainId = yield call([ethClient, 'getChainId']);
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.CONNECTED,
        account: connectedAccount,
        networkId: parseInt(chainId)
      })
    );
  } else if (ethClient.ethereum) {
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.NOT_AVAILABLE
      })
    );
  }

  yield put(web3Actions.initWeb3Success({ web3Client: ethClient }));
}

export function* installWallet() {
  // @TODO
}

export function* connectWallet() {
  try {
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.CONNECTING
      })
    );
    yield call([ethClient, 'connectWallet']);
  } catch (error) {
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.NOT_CONNECTED
      })
    );

    let body;
    if (error.code === -32002) {
      body =
        'There was an error connecting to MetaMask. Please try connecting manually to MetaMask by clicking on the MetaMask wallet.';
    } else if (error.code === 4001) {
      body = 'The request to connect was rejected.';
    } else {
      console.error(error);
      body = 'There was an errro connecting to MetaMask';
    }

    const modalProps = {
      title: 'Failed to connect',
      body
    };

    yield put(mediator.actions.showModal(modalProps));
  }
}
