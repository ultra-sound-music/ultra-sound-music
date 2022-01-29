import { put, select } from 'redux-saga/effects';
import constants from '@constants';
import utils from '@utils';
import { storeUtils } from '@usm/store/utils';
import mediator from '@usm/store/mediator';

import * as usmActions from '../actions';
import * as usmSelectors from '../selectors';

export function onCreateArtistComplete({
  transaction,
  data: { metadataUri, artistDNA }
}) {
  const store = storeUtils.getStore();
  store.dispatch(
    usmActions.updateTransaction({
      key: utils.genCreateArtistTransactionKey(artistDNA),
      transaction,
      status: constants.usm.transactionStatus.MINED
    })
  );
  store.dispatch(
    usmActions.fetchAllTokens({
      pendingTransactionType: 'create-artist',
      pendingMetadataUri: metadataUri
    })
  );
}

export function onCreateBandComplete({
  transaction,
  data: { metadataUri, artistTid }
}) {
  const store = storeUtils.getStore();
  store.dispatch(
    usmActions.updateTransaction({
      key: utils.genStartBandTransactionKey(artistTid),
      transaction,
      status: constants.usm.transactionStatus.MINED
    })
  );
  store.dispatch(
    usmActions.fetchAllTokens({
      pendingTransactionType: 'start-band',
      pendingMetadataUri: metadataUri
    })
  );
}

export function onJoinBandComplete({
  transaction,
  data: { metadataUri, bandTid, artistTid }
}) {
  const store = storeUtils.getStore();
  store.dispatch(
    usmActions.updateTransaction({
      key: utils.genJoinBandTransactionKey(bandTid, artistTid),
      transaction,
      status: constants.usm.transactionStatus.MINED
    })
  );
  store.dispatch(
    usmActions.fetchAllTokens({
      pendingTransactionType: 'join-band',
      pendingMetadataUri: metadataUri
    })
  );
}

export function onCreateTrackComplete({
  transaction,
  data: { metadataUri, bandTid, artistTid }
}) {
  const store = storeUtils.getStore();
  store.dispatch(
    usmActions.updateTransaction({
      key: utils.genCreateTrackTransactionKey(bandTid, artistTid),
      transaction,
      status: constants.usm.transactionStatus.MINED
    })
  );
  store.dispatch(
    usmActions.fetchAllTokens({
      pendingTransactionType: 'create-track',
      pendingMetadataUri: metadataUri
    })
  );
}

export function* initializeActiveArtist() {
  const activeArtistId = yield select(usmSelectors.getActiveArtistId);
  if (activeArtistId) {
    return;
  }

  const accountAddress = yield select(mediator.selectors.getAccountAddress);
  const artistEntities = yield select(usmSelectors.selectAllArtistEntities);

  const activeArtistEntity = artistEntities.find((entity) => {
    return entity.owner === accountAddress;
  });

  if (activeArtistEntity) {
    yield put(usmActions.setActiveArtist({ artistId: activeArtistEntity.id }));
  }
}

export function* initializeActiveBand() {
  const activeBandId = yield select(usmSelectors.getActiveBandId);
  if (activeBandId) {
    return;
  }

  const activeArtistBands = yield select(usmSelectors.getActiveArtistBands);
  const activeBand = activeArtistBands[0];
  if (activeBand) {
    yield put(usmActions.setActiveBand({ bandId: activeBand.id }));
  }
}
