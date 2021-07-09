import { put, call, select } from 'redux-saga/effects';
import USMClient from '../../../lib/USMClient';
import * as Constants from '../../../constants';
import * as Utils from '../../../utils';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';
import * as Helpers from './helpers';

let usmClient;

export function* init({ data }) {
  const ethClient = data?.web3Client;
  // @todo optimize this loading to be async and not block the app
  const {default: abi} = yield call(() => import('../../../deps/usmAbi'));
  
  const webserverDomain = `//${document.location.host}`;
  const apiHost = webserverDomain.replace('9000', '9001');
  usmClient = new USMClient({
    contractAddress: Constants.web3.CONTRACT_ADDRESS,
    abi,
    apiHost,
    accountAddress: yield select(Selectors.web3.getAccountAddress),
    provider: ethClient.provider,
    logger: Utils.logger
  });

  yield put(Actions.usm.fetchAllTokens());
}

export function* refresh() {
  yield put(Actions.usm.fetchAllTokens());
}

export function* fetchAllTokens() {
  const tokens = yield call([usmClient, 'fetchAll']);
  yield put(Actions.usm.setTokens({ tokens }));
  yield call(Helpers.initializeActiveArtist);
  yield call(Helpers.initializeActiveBand);  
}

export function* createArtist({ data }) {
  const {
    name,
    description
  } = data;

  const artistDNA = yield select(Selectors.web3.getAccountAddress);
  const key = yield call(Utils.usm.genCreateArtistTransactionKey, artistDNA);
  yield put(Actions.usm.addTransaction({
    method: 'createArtist',
    key
  }));

  try {
    const transaction = yield call([usmClient, 'createArtist'], { artistDNA, name, description }, Helpers.onCreateArtistComplete);
    yield put(Actions.usm.updateTransaction({
      key,
      transactionId: transaction.hash,
      status: Constants.usm.transactionStatus.AUTHORIZED
    }));
  } catch (error) {
    console.error(error);
    yield put(Actions.ui.showModal({
      title: 'Error',
      bodyText: error.message
    }));
    yield put(Actions.usm.updateTransaction({
      key,
      status: Constants.usm.transactionStatus.FAILED,
      errorCode: error.code,
      errorMessage: error.message
    }));
  }
}

export function* startBand({ data }) {
  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const {
    name,
    description,
  } = data;

  const bandLeaderArtistId = yield select(Selectors.usm.getActiveArtistId);
  const key = yield call(Utils.usm.genStartBandTransactionKey, bandLeaderArtistId);
  yield put(Actions.usm.addTransaction({
    method: 'startBand',
    key
  }));  

  try {
    const transaction = yield call([usmClient, 'startBand'], { name, description, bandLeaderArtistId }, Helpers.onCreateBandComplete);
    yield put(Actions.usm.updateTransaction({
      key,
      transactionId: transaction.hash,
      status: Constants.usm.transactionStatus.AUTHORIZED
    }));    
  } catch (error) {
    console.error(error);
    yield put(Actions.ui.showModal({
      title: 'Error',
      bodyText: error.message
    }));
    yield put(Actions.usm.updateTransaction({
      key,
      status: Constants.usm.transactionStatus.FAILED,
      errorCode: error.code,
      errorMessage: error.message
    }));
  }
}

export function* joinBand({ data }) {
  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const {
    bandId
  } = data;

  const artistId = yield select(Selectors.usm.getActiveArtistId);
  const key = yield call(Utils.usm.genJoinBandTransactionKey, bandId, artistId);
  yield put(Actions.usm.addTransaction({
    method: 'joinBand',
    key
  }));  

  try {
    const transaction = yield call([usmClient, 'joinBand'], { bandId, artistId }, Helpers.onJoinBandComplete);
    yield put(Actions.usm.updateTransaction({
      key,
      transactionId: transaction.hash,
      status: Constants.usm.transactionStatus.AUTHORIZED
    }));
  } catch (error) {
    yield put(Actions.ui.showModal({
      title: 'Error',
      bodyText: error?.data?.message || error.message
    }));
    yield put(Actions.usm.updateTransaction({
      key,
      status: Constants.usm.transactionStatus.FAILED,
      errorCode: error.code,
      errorMessage: error?.data?.message || error.message
    }));
  }  
}

export function* createTrack({ data }) {
  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  const {
    name,
    description    
  } = data;

  const artistId = yield select(Selectors.usm.getActiveArtistId);
  const bandId = yield select(Selectors.usm.getActiveBandId);
  const key = yield call(Utils.usm.genCreateTrackTransactionKey, bandId, artistId);

  yield put(Actions.usm.addTransaction({
    method: 'joinBand',
    key
  }));

  try {
    const transaction = yield call([usmClient, 'createTrack'], { artistId, bandId, name, description }, Helpers.onCreateTrackComplete);
    yield put(Actions.usm.updateTransaction({
      key,
      transactionId: transaction.hash,
      status: Constants.usm.transactionStatus.AUTHORIZED
    }));    
  } catch (error) {
    yield put(Actions.ui.showModal({
      title: 'Error',
      bodyText: error?.data?.message || error.message
    }));
    yield put(Actions.usm.updateTransaction({
      key,
      status: Constants.usm.transactionStatus.FAILED,
      errorCode: error.code,
      errorMessage: error?.data?.message || error.message
    }));
  }
}