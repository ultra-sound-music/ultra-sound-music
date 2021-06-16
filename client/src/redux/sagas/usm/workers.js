import { put, call, select } from 'redux-saga/effects';
import USMClient from '../../../utils/lib/USMClient';
import * as Constants from '../../../constants';
import * as Utils from '../../../utils';
import * as Actions from '../../../redux/actions';
import * as Selectors from '../../../redux/selectors';

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

export function* createArtist({ type, data }) {
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
    const { transactionId, onComplete } = yield call([usmClient, 'createArtist'], { artistDNA, name, description });
    onComplete(function* (transaction) {
      yield put(Actions.web3.updateTransaction({
        key: artistDNA,
        block: transaction.block,
        status: Constants.web3.transactionStatus.MINED
      }));
    });

    yield put(Actions.web3.updateTransaction({
      key: artistDNA,
      transactionId,
      status: Constants.web3.transactionStatus.APPROVED
    }));
  } catch (error) {
    yield put(Actions.web3.updateTransaction({
      key: artistDNA,
      status: Constants.web3.transactionStatus.FAILED,
      errorCode: '',
      errorMessage: ''
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