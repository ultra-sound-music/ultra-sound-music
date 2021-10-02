import { put, call, select } from 'redux-saga/effects';
import USMClient from '../../../lib/USMClient';
import copy from '@copy';
import constants from '@constants';
import * as Utils from '../../../utils';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../selectors/core';
import * as Helpers from './helpers';

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
    accountAddress: yield select(Selectors.web3.getAccountAddress),
    apiHost: `//${document.location.host}`,
    provider: ethClient.provider,
    logger: Utils.logger
  });

  HACK_RES(usmClient);
  yield put(Actions.usm.fetchAllTokens());
}

export function* fetchNewMints() {
  yield HACK;
  try {
    // @TODO disabled while waiting for endpoing
    // const response = yield call([usmClient, 'fetchNewMints']);
    yield put(Actions.usm.fetchNewMintsSuccess({ mints: {} }));
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
    yield put(Actions.usm.fetchTokensComplete({ tokens: response?.data }));
  } catch (error) {
    console.error(error);
    yield put(
      Actions.ui.showAppMessage({
        title: copy.error,
        message: copy.problem_connecting,
        timeout: 5000
      })
    );
  }

  yield call(Helpers.initializeActiveArtist);
  yield call(Helpers.initializeActiveBand);
}

export function* createArtist() {
  const networkStatus = yield select(Selectors.web3.getNetworkStatus);
  if (!networkStatus) {
    yield put(Actions.ui.showInstallWalletModal());
    return;
  } else if (networkStatus === constants.web3.networkStatus.NOT_AVAILABLE) {
    yield put(Actions.web3.connectWallet());
    return;
  }

  const artistDNA = yield select(Selectors.web3.getAccountAddress);
  const key = yield call(Utils.usm.genCreateArtistTransactionKey, artistDNA);
  yield put(
    Actions.usm.addTransaction({
      method: 'createArtist',
      key
    })
  );

  try {
    const transaction = yield call(
      [usmClient, 'createArtist'],
      Helpers.onCreateArtistComplete
    );
    yield put(
      Actions.usm.updateTransaction({
        key,
        transactionId: transaction.hash,
        status: constants.usm.transactionStatus.AUTHORIZED
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      Actions.ui.showModal({
        title: 'Error',
        body: 'Unable to create an artist, please try again later.'
      })
    );
    yield put(
      Actions.usm.updateTransaction({
        key,
        status: constants.usm.transactionStatus.FAILED,
        errorCode: error.code,
        errorMessage: error.message
      })
    );
  }
}

export function* startBand() {
  const networkStatus = yield select(Selectors.web3.getNetworkStatus);
  if (!networkStatus) {
    yield put(Actions.ui.showInstallWalletModal());
    return;
  }

  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const artistTid = yield select(Selectors.usm.getActiveArtistTid);
  const key = yield call(Utils.usm.genStartBandTransactionKey, artistTid);
  yield put(
    Actions.usm.addTransaction({
      method: 'startBand',
      key
    })
  );

  try {
    const transaction = yield call(
      [usmClient, 'startBand'],
      { artistTid },
      Helpers.onCreateBandComplete
    );
    yield put(
      Actions.usm.updateTransaction({
        key,
        transactionId: transaction.hash,
        status: constants.usm.transactionStatus.AUTHORIZED
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      Actions.ui.showModal({
        title: 'Error',
        body: 'Unable to start a band, please try again later.'
      })
    );
    yield put(
      Actions.usm.updateTransaction({
        key,
        status: constants.usm.transactionStatus.FAILED,
        errorCode: error.code,
        errorMessage: error.message
      })
    );
  }
}

export function* joinBand({ data }) {
  const networkStatus = yield select(Selectors.web3.getNetworkStatus);
  if (!networkStatus) {
    yield put(Actions.ui.showInstallWalletModal());
    return;
  }

  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const { bandId } = data;

  const bandTid = yield select(Selectors.usm.getTokenId, bandId);
  const artistTid = yield select(Selectors.usm.getActiveArtistTid);
  const key = yield call(
    Utils.usm.genJoinBandTransactionKey,
    bandTid,
    artistTid
  );
  yield put(
    Actions.usm.addTransaction({
      method: 'joinBand',
      key
    })
  );

  try {
    const transaction = yield call(
      [usmClient, 'joinBand'],
      { bandTid, artistTid },
      Helpers.onJoinBandComplete
    );
    yield put(
      Actions.usm.updateTransaction({
        key,
        transactionId: transaction.hash,
        status: constants.usm.transactionStatus.AUTHORIZED
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      Actions.ui.showModal({
        title: 'Error',
        body: 'Unable to join the band, please try again later.'
      })
    );
    yield put(
      Actions.usm.updateTransaction({
        key,
        status: constants.usm.transactionStatus.FAILED,
        errorCode: error.code,
        errorMessage: error?.data?.message || error.message
      })
    );
  }
}

export function* createTrack({ data }) {
  const networkStatus = yield select(Selectors.web3.getNetworkStatus);
  if (!networkStatus) {
    yield put(Actions.ui.showInstallWalletModal());
    return;
  }

  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const { name, description, bandId } = data;

  const artistTid = yield select(Selectors.usm.getActiveArtistTid);
  const bandTid = yield select(Selectors.usm.getTokenId, bandId);
  const key = yield call(
    Utils.usm.genCreateTrackTransactionKey,
    bandTid,
    artistTid
  );

  yield put(
    Actions.usm.addTransaction({
      method: 'joinBand',
      key
    })
  );

  try {
    const transaction = yield call(
      [usmClient, 'createTrack'],
      { artistTid, bandTid, name, description },
      Helpers.onCreateTrackComplete
    );
    yield put(
      Actions.usm.updateTransaction({
        key,
        transactionId: transaction.hash,
        status: constants.usm.transactionStatus.AUTHORIZED
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      Actions.ui.showModal({
        title: 'Error',
        body: 'Unable to create a track, please try again later.'
      })
    );
    yield put(
      Actions.usm.updateTransaction({
        key,
        status: constants.usm.transactionStatus.FAILED,
        errorCode: error.code,
        errorMessage: error?.data?.message || error.message
      })
    );
  }
}
