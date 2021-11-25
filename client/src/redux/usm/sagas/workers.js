import { put, call, select } from 'redux-saga/effects';

import USMClient from '@lib/UsmClient';
import copy from '@copy';
import constants from '@constants';
import utils from '@utils';
import mediator from '@store/mediator';

import * as actions from '../actions';
import * as selectors from '../selectors';
import * as helpers from './helpers';

let usmClient;

// There's a race condition where fetchNewMints() is called before init() but I don't have time to dig in right now
let HACK_RES;
const HACK = new Promise((res) => {
  HACK_RES = res;
});

export function* init({ data }) {
  const ethClient = data?.web3Client;
  // @todo optimize this loading to be async and not block the app
  const {
    default: { artist: artistConfig, band: bandConfig, track: trackConfig }
  } = yield call(() => import('../../../deps/tokenConfigs'));

  usmClient = new USMClient({
    artistConfig,
    bandConfig,
    trackConfig,
    accountAddress: yield select(mediator.selectors.getAccountAddress),
    apiHost: `//${document.location.host}`,
    provider: ethClient.provider,
    logger: utils.logger
  });

  HACK_RES(usmClient);
  yield put(actions.fetchAllTokens());
}

export function* fetchNewMints() {
  yield HACK;
  try {
    // @TODO disabled while waiting for endpoing
    // const response = yield call([usmClient, 'fetchNewMints']);
    yield put(actions.fetchNewMintsSuccess({ mints: {} }));
  } catch (error) {
    console.log(error);
  }
}

export function* fetchAllTokens({ data }) {
  const type = data?.pendingTransactionType;
  const metadataUri = data?.pendingMetadataUri;

  let pendingTransaction;
  if (type && metadataUri) {
    pendingTransaction = {
      type: data?.pendingTransactionType,
      metadataUri: data?.pendingMetadataUri
    };
  }

  try {
    const response = yield call([usmClient, 'fetchAll'], {
      pendingTransaction
    });
    yield put(actions.fetchTokensComplete({ tokens: response?.data }));
  } catch (error) {
    console.error(error);
    yield put(
      mediator.actions.showAppMessage({
        title: copy.error,
        message: copy.problem_connecting,
        timeout: 5000
      })
    );
  }

  yield call(helpers.initializeActiveArtist);
  yield call(helpers.initializeActiveBand);
}

export function* createArtist({ data }) {
  const networkStatus = yield select(mediator.selectors.getNetworkStatus);
  if (!networkStatus) {
    yield put(mediator.actions.showInstallWalletModal());
    return;
  } else if (networkStatus === mediator.constants.networkStatus.NOT_AVAILABLE) {
    yield put(mediator.actions.connectWallet());
    return;
  }

  const imageUrl = data.imageUrl;
  const artistDNA = yield select(mediator.selectors.getAccountAddress);
  const key = yield call(utils.genCreateArtistTransactionKey, artistDNA);
  yield put(
    actions.addTransaction({
      method: 'createArtist',
      key
    })
  );

  try {
    const transaction = yield call(
      [usmClient, 'createArtist'],
      { imageUrl },
      helpers.onCreateArtistComplete
    );
    yield put(
      actions.updateTransaction({
        key,
        transactionId: transaction.hash,
        status: constants.usm.transactionStatus.AUTHORIZED
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      mediator.actions.showModal({
        title: 'Error',
        body: 'Unable to create an artist, please try again later.'
      })
    );
    yield put(
      actions.updateTransaction({
        key,
        status: constants.usm.transactionStatus.FAILED,
        errorCode: error.code,
        errorMessage: error.message
      })
    );
  }
}

export function* startBand() {
  const networkStatus = yield select(mediator.selectors.getNetworkStatus);
  if (!networkStatus) {
    yield put(mediator.actions.showInstallWalletModal());
    return;
  }

  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const artistTid = yield select(selectors.getActiveArtistTid);
  const key = yield call(utils.genStartBandTransactionKey, artistTid);
  yield put(
    actions.addTransaction({
      method: 'startBand',
      key
    })
  );

  try {
    const transaction = yield call(
      [usmClient, 'startBand'],
      { artistTid },
      helpers.onCreateBandComplete
    );
    yield put(
      actions.updateTransaction({
        key,
        transactionId: transaction.hash,
        status: constants.usm.transactionStatus.AUTHORIZED
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      mediator.actions.showModal({
        title: 'Error',
        body: 'Unable to start a band, please try again later.'
      })
    );
    yield put(
      actions.updateTransaction({
        key,
        status: constants.usm.transactionStatus.FAILED,
        errorCode: error.code,
        errorMessage: error.message
      })
    );
  }
}

export function* joinBand({ data }) {
  const networkStatus = yield select(mediator.selectors.getNetworkStatus);
  if (!networkStatus) {
    yield put(mediator.actions.showInstallWalletModal());
    return;
  }

  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const { bandId } = data;

  const bandTid = yield select(selectors.getTokenId, bandId);
  const artistTid = yield select(selectors.getActiveArtistTid);
  const key = yield call(utils.genJoinBandTransactionKey, bandTid, artistTid);
  yield put(
    actions.addTransaction({
      method: 'joinBand',
      key
    })
  );

  try {
    const transaction = yield call(
      [usmClient, 'joinBand'],
      { bandTid, artistTid },
      helpers.onJoinBandComplete
    );
    yield put(
      actions.updateTransaction({
        key,
        transactionId: transaction.hash,
        status: constants.usm.transactionStatus.AUTHORIZED
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      mediator.actions.showModal({
        title: 'Error',
        body: 'Unable to join the band, please try again later.'
      })
    );
    yield put(
      actions.updateTransaction({
        key,
        status: constants.usm.transactionStatus.FAILED,
        errorCode: error.code,
        errorMessage: error?.data?.message || error.message
      })
    );
  }
}

export function* createTrack({ data }) {
  const networkStatus = yield select(mediator.selectors.getNetworkStatus);
  if (!networkStatus) {
    yield put(mediator.actions.showInstallWalletModal());
    return;
  }

  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const { name, description, bandId } = data;

  const artistTid = yield select(selectors.getActiveArtistTid);
  const bandTid = yield select(selectors.getTokenId, bandId);
  const key = yield call(
    utils.genCreateTrackTransactionKey,
    bandTid,
    artistTid
  );

  yield put(
    actions.addTransaction({
      method: 'joinBand',
      key
    })
  );

  try {
    const transaction = yield call(
      [usmClient, 'createTrack'],
      { artistTid, bandTid, name, description },
      helpers.onCreateTrackComplete
    );
    yield put(
      actions.updateTransaction({
        key,
        transactionId: transaction.hash,
        status: constants.usm.transactionStatus.AUTHORIZED
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      mediator.actions.showModal({
        title: 'Error',
        body: 'Unable to create a track, please try again later.'
      })
    );
    yield put(
      actions.updateTransaction({
        key,
        status: constants.usm.transactionStatus.FAILED,
        errorCode: error.code,
        errorMessage: error?.data?.message || error.message
      })
    );
  }
}
