import { put, select } from 'redux-saga/effects';
import * as ReduxUtils from '../../utils';
import * as Actions from '../../actions';
import * as Constants from '../../../constants';
import * as Utils from '../../../utils';
import * as Selectors from '../../../redux/selectors';

export function onCreateArtistComplete({ transaction, data: { artistDNA }}) {
  const store = ReduxUtils.getStore();
  debugger;
  store.dispatch(Actions.usm.updateTransaction({
    key: Utils.usm.genCreateArtistTransactionKey(artistDNA),
    transaction,
    status: Constants.usm.transactionStatus.MINED
  }));
  store.dispatch(Actions.usm.refresh());
}

export function onCreateBandComplete({ transaction, data: { artistTid }}) {
  const store = ReduxUtils.getStore();
  store.dispatch(Actions.usm.updateTransaction({
    key: Utils.usm.genStartBandTransactionKey(artistTid),
    transaction,
    status: Constants.usm.transactionStatus.MINED
  }));
  store.dispatch(Actions.usm.refresh());
}

export function onJoinBandComplete({ transaction, data: { bandTid, artistTid }}) {
  const store = ReduxUtils.getStore();
  store.dispatch(Actions.usm.updateTransaction({
    key: Utils.usm.genJoinBandTransactionKey(bandTid, artistTid),
    transaction,
    status: Constants.usm.transactionStatus.MINED
  }));
  store.dispatch(Actions.usm.refresh());
}

export function onCreateTrackComplete({ transaction, data: { bandTid, artistTid }}) {
  const store = ReduxUtils.getStore();
  store.dispatch(Actions.usm.updateTransaction({
    key: Utils.usm.genCreateTrackTransactionKey(bandTid, artistTid),
    transaction,
    status: Constants.usm.transactionStatus.MINED
  }));
  store.dispatch(Actions.usm.refresh());
}

export function* initializeActiveArtist() {
  const activeArtistId = yield select(Selectors.usm.getActiveArtistId);
  if (activeArtistId) {
    return;
  }

  const accountAddress = yield select(Selectors.web3.getAccountAddress);
  const artistEntities = yield select(Selectors.usm.selectAllArtistEntities);
  
  const activeArtistEntity = artistEntities.find((entity) => {
    return entity.owner === accountAddress;
  })

  if (activeArtistEntity) {
    yield put(Actions.usm.setActiveArtist({ artistId: activeArtistEntity._id }));
  }
}

export function* initializeActiveBand() {
  const activeBandId = yield select(Selectors.usm.getActiveBandId);
  if (activeBandId) {
    return;
  }

  const activeArtistBands = yield select(Selectors.usm.getActiveArtistBands);
  const activeBand = activeArtistBands[0];
  if (activeBand) {
    yield put(Actions.usm.setActiveBand({ bandId: activeBand._id }));
  }
}