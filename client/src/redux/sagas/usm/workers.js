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
    accountAddress: yield select(Selectors.web3.getAccountAddress),
    provider: Utils.web3.getProvider(),
    logger: Utils.logger
  });

  yield put(Actions.usm.fetchAllTokens());

  // @TODO - for now, just set their first artist by default - do something smarter eventually
  // const activeArtist = yield select(Selectors.usm.getActiveArtist);
  // if (!activeArtist) {
  //   const artist = yield select(Selectors.getActiveArtist);
  //   if (artist) {
  //     yield put(Actions.usm.setActiveArtist({ artistTokenId: artist.tokenId}))
  //   }
  // }
}

export function* updateNetworkStatus({ data }) {
  const newAccountAddress = data?.address;
  if (newAccountAddress !== usmClient.accountAddress) {
    yield call([usmClient, 'updateAccount'], { accountAddress: newAccountAddress });

    // @TODO This sets the active artist - it introduces a race condition where it would fail if called before tokens are loaded
    // We should have some way of knowing if tokens have been loaded / waiting for them to load
    const artistEntities = yield select(Selectors.usm.selectAllArtistEntities);
    const activeArtistEntity = artistEntities.find((entity) => {
      return entity.owner === newAccountAddress;
    })
  
    if (activeArtistEntity) {
      yield put(Actions.usm.setActiveArtist({ artistTokenId: activeArtistEntity.tokenId }));
    }
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
  yield put(Actions.web3.addTransaction({
    method: 'createArtist',
    key: artistDNA
  }));

  try {
    const transaction = yield call([usmClient, 'createArtist'], { artistDNA, name, description }, Helpers.onCreateArtistComplete);
    yield put(Actions.web3.updateTransaction({
      key: artistDNA,
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
      key: artistDNA,
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

  try {
    const transaction = yield call([usmClient, 'startBand'], { name, description, bandLeaderArtistId }, Helpers.onCreateBandComplete);
    yield put(Actions.web3.updateTransaction({
      key: bandLeaderArtistId,
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
      key: bandLeaderArtistId,
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
    bandTokenId: bandId
  } = data;

  const artistId = yield select(Selectors.getActiveArtistId);
  const key = `joinband-${bandId}`;

  try {
    const transaction = yield call([usmClient, 'joinBand'], { artistId, bandId }, Helpers.onJoinBandComplete);
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