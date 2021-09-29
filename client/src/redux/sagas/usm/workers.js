import { put, call, select } from 'redux-saga/effects';
import USMClient from '../../../lib/USMClient';
import constants from '@constants';
import * as Utils from '../../../utils';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../selectors/core';
import * as Helpers from './helpers';

let usmClient;

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

  yield put(Actions.usm.fetchAllTokens());
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

  const response = yield call([usmClient, 'fetchAll'], { pendingTransaction });

  yield put(Actions.usm.fetchTokensComplete({ tokens: response?.data }));
  yield call(Helpers.initializeActiveArtist);
  yield call(Helpers.initializeActiveBand);
}

export function* createArtist() {
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
        bodyText: error.message
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
        bodyText: error.message
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
    yield put(
      Actions.ui.showModal({
        title: 'Error',
        bodyText: error?.data?.message || error.message
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
    yield put(
      Actions.ui.showModal({
        title: 'Error',
        bodyText: error?.data?.message || error.message
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
