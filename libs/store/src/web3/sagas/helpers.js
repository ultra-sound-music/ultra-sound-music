import { put, takeEvery, call, fork, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import * as web3Selectors from '../selectors';
import * as web3Constants from '../constants';
import * as web3Actions from '../actions';
import * as web3Utils from './utils';
import mediator from '@usm/store/mediator';

let web3Client;
let web3EventChannel;

export function* init(action, { web3Client: client, eventListeners, autoConnect }) {
  web3Client = client;

  if (web3Client.init && autoConnect) {
    yield call([web3Client, web3Client.init]);
  }

  let connectedAccount = yield call([web3Client, web3Client.getWalletAddress]);

  if (web3Client.isWeb3Available) {
    yield fork(startWatchingForWalletEvents, web3Client, eventListeners, [web3Client]);
  }

  if (connectedAccount) {
    const networkId = web3Client.getNetworkId();
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.CONNECTED,
        account: connectedAccount,
        networkId: parseInt(networkId)
      })
    );
  } else if (web3Client.isWeb3Available) {
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.NOT_AVAILABLE
      })
    );
  }

  yield put(web3Actions.initWeb3Success({ web3Client }));
  return web3Client;
}

export function* connectWallet(action, { parseError }) {
  try {
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.CONNECTING
      })
    );
    yield call([web3Client, 'connectWallet']);
  } catch (error) {
    yield put(
      web3Actions.updateNetworkStatus({
        status: web3Constants.networkStatus.NOT_CONNECTED
      })
    );

    const modalBody = parseError(error);

    const modalProps = {
      title: 'Failed to connect',
      body: modalBody
    };

    yield put(mediator.actions.showModal(modalProps));
  }
}

export function* processAccountUpdate({ data }) {
  const { status, account } = data;

  const activeAccount = yield select(web3Selectors.getAccountAddress);
  if (account !== activeAccount) {
    yield put(mediator.actions.initApp({ isUpdate: true }));
    return;
  }

  yield put(web3Actions.updateNetworkStatus({ status, account }));
}

export function* processNetworkUpdate({ data }) {
  const { networkId } = data;

  const activeNetworkId = yield select(web3Selectors.getNetworkId);
  if (activeNetworkId !== networkId) {
    yield put(web3Actions.init());
    return;
  }

  yield put(web3Actions.updateNetworkStatus({ networkId }));
}

export function* onUpdateNetworkStatus(
  { data },
  { isValidTestNetworkId, isValidProductionNetworkId }
) {
  const { networkId } = data;
  if (!networkId) {
    return;
  }

  const isValidProductionNetwork = isValidProductionNetworkId(networkId);
  if (!isValidProductionNetwork) {
    const isValidTestNetwork = isValidTestNetworkId(networkId);
    if (!isValidTestNetwork) {
      yield put(
        mediator.actions.showModal({
          title: 'Unrecognized Network',
          body: 'Please switch to a valid Ethereum network.'
        })
      );
    } else {
      yield put(
        mediator.actions.showAppMessage({
          title: 'Test Mode',
          message: 'You have connected using an Ethereum test network',
          timeout: 4000
        })
      );
    }
  }
}

export function* startWatchingForWalletEvents(web3Client, eventListeners, eventArgs) {
  if (web3EventChannel) {
    web3EventChannel.close();
  }

  web3EventChannel = createEventChannel(web3Client, eventListeners, eventArgs);
  yield takeEvery(web3EventChannel, function* (action) {
    yield put(action);
  });
}

export function createEventChannel(web3Client, eventListeners, eventArgs) {
  return eventChannel((emitter) => {
    const boundEventListeners = web3Utils.bindCoreEventListeners(
      emitter,
      web3Client,
      eventListeners,
      eventArgs
    );
    return () => {
      web3Utils.removeCoreEventListeners(web3Client, boundEventListeners);
    };
  });
}
