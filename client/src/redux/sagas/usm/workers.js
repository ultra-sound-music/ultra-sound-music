import { put, call, select } from 'redux-saga/effects';
import USMClient from '../../../lib/USMClient';
import * as Constants from '../../../constants';
import * as Utils from '../../../utils';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';
import * as Helpers from './helpers';

let usmClient;

export function* init() {
  // @todo optimize this loading to be async and not block the app
  const {default: abi} = yield call(() => import('../../../lib/usmAbi.js'));
  
  const webserverDomain = `//${document.location.host}`;
  const apiHost = webserverDomain.replace('9000', '9001');
  usmClient = new USMClient({
    contractAddress: Constants.web3.CONTRACT_ADDRESS,
    abi,
    apiHost,
    accountAddress: yield select(Selectors.web3.getAccountAddress),
    provider: Utils.web3.getProvider(),
    logger: Utils.logger
  });

  yield put(Actions.usm.fetchAllTokens());
  yield call(Helpers.updateActiveArtist);
}

export function* refresh() {
  yield put(Actions.usm.fetchAllTokens());
  yield call(Helpers.updateActiveArtist);
}

export function* updateNetworkStatus({ data }) {
  const newAccountAddress = data?.address;
  if (newAccountAddress !== usmClient.accountAddress) {
    yield call([usmClient, 'updateAccount'], { accountAddress: newAccountAddress });
    yield put(Actions.usm.refresh());
  }
}

export function* fetchAllTokens() {
  const tokens = yield call([usmClient, 'fetchAll']);
  yield put(Actions.usm.setTokens({ tokens }));
}

export function* createArtist({ data }) {
  const {
    name,
    description
  } = data;

  const artistDNA = yield select(Selectors.web3.getAccountAddress);
  const key = yield call(Utils.web3.genCreateArtistTransactionKey, artistDNA);
  yield put(Actions.web3.addTransaction({
    method: 'createArtist',
    key
  }));

  try {
    const transaction = yield call([usmClient, 'createArtist'], { artistDNA, name, description }, Helpers.onCreateArtistComplete);
    yield put(Actions.web3.updateTransaction({
      key,
      transactionId: transaction.hash,
      status: Constants.web3.transactionStatus.AUTHORIZED
    }));
  } catch (error) {
    console.error(error);
    yield put(Actions.ui.showModal({
      title: 'Error',
      bodyText: error.message
    }));
    yield put(Actions.web3.updateTransaction({
      key,
      status: Constants.web3.transactionStatus.FAILED,
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
  const key = yield call(Utils.web3.genStartBandTransactionKey, bandLeaderArtistId);
  yield put(Actions.web3.addTransaction({
    method: 'startBand',
    key
  }));  

  try {
    const transaction = yield call([usmClient, 'startBand'], { name, description, bandLeaderArtistId }, Helpers.onCreateBandComplete);
    yield put(Actions.web3.updateTransaction({
      key,
      transactionId: transaction.hash,
      status: Constants.web3.transactionStatus.AUTHORIZED
    }));    
  } catch (error) {
    console.error(error);
    yield put(Actions.ui.showModal({
      title: 'Error',
      bodyText: error.message
    }));
    yield put(Actions.web3.updateTransaction({
      key,
      status: Constants.web3.transactionStatus.FAILED,
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
  const key = yield call(Utils.web3.genJoinBandTransactionKey, bandId, artistId);

  yield put(Actions.web3.addTransaction({
    method: 'joinBand',
    key
  }));  

  try {
    const transaction = yield call([usmClient, 'joinBand'], { bandId, artistId }, Helpers.onJoinBandComplete);
    yield put(Actions.web3.updateTransaction({
      key,
      transactionId: transaction.hash,
      status: Constants.web3.transactionStatus.AUTHORIZED
    }));    
  } catch (error) {
    yield put(Actions.ui.showModal({
      title: 'Error',
      bodyText: error?.data?.message || error.message
    }));
    yield put(Actions.web3.updateTransaction({
      key,
      status: Constants.web3.transactionStatus.FAILED,
      errorCode: error.code,
      errorMessage: error?.data?.message || error.message
    }));
  }  
}

export function* createTrack(bandId, name, description) {
  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  function onComplete() {

  }

  try {
    yield call(usmClient.createTrack, name, description, onComplete);
  } catch (error) {
    console.log(error);
  }
}