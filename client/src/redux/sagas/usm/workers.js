import { put, call, select } from 'redux-saga/effects';
import USMClient from '../../../utils/lib/USMClient';
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
    currentAccountAddress: yield select(Selectors.web3.getAccountAddress),
    provider: Utils.web3.getProvider(),
    logger: Utils.logger
  });

  const tokens = yield call([usmClient, 'fetchAll']);
  yield put(Actions.usm.setTokens({ tokens }));
}

export function* fetchAllTokens() {
  const tokens = yield call(usmClient.fetchAll);
  yield put(Actions.usm.setTokens(tokens));
}

export function* createArtist({ data }) {
  const {
    name,
    description
  } = data;

  const artistDNA = yield select(Selectors.web3.getAccountAddress);
  yield put(Actions.web3.addTransaction({
    method: 'createArtist',
    key: artistDNA
  }));

  try {
    const { transaction } = yield call([usmClient, 'createArtist'], { artistDNA, name, description }, Helpers.onCreateArtistComplete);
    yield put(Actions.web3.updateTransaction({
      key: artistDNA,
      transactionId: transaction.hash,
      status: Constants.web3.transactionStatus.AUTHORIZED
    }));
  } catch (error) {
    yield put(Actions.web3.updateTransaction({
      key: artistDNA,
      status: Constants.web3.transactionStatus.FAILED,
      errorCode: error.code,
      errorMessage: error.message
    }));
  }
}

export function* createBand(name, description) {
  if (!usmClient) {
    throw new Error('USM not initialized');
  }

  function onComplete() {

  }

  try {
    yield call(usmClient.createBand, name, description, onComplete);
  } catch (error) {
    console.log(error);
  }
}

export function* createTrack(bandTokenId, name, description) {
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