import { put, select } from 'redux-saga/effects';
import * as ReduxUtils from '../../utils';
import * as Actions from '../../actions';
import * as Constants from '../../../constants';
import * as Utils from '../../../utils';
import * as Selectors from '../../../redux/selectors';

export function onCreateArtistComplete({ transaction, data }) {
  const store = ReduxUtils.getStore();
  store.dispatch(Actions.web3.updateTransaction({
    key: Utils.web3.genCreateArtistTransactionKey(data.artistDNA),
    transaction,
    status: Constants.web3.transactionStatus.MINED
  }));
  store.dispatch(Actions.usm.refresh());
}

export function onCreateBandComplete({ transaction, data }) {
  const store = ReduxUtils.getStore();
  store.dispatch(Actions.web3.updateTransaction({
    key: Utils.web3.genStartBandTransactionKey(data.bandLeaderArtistId),
    transaction,
    status: Constants.web3.transactionStatus.MINED
  }));
  store.dispatch(Actions.usm.refresh());
}

export function onJoinBandComplete({ transaction, data }) {
  const store = ReduxUtils.getStore();
  store.dispatch(Actions.web3.updateTransaction({
    key: Utils.web3.genJoinBandTransactionKey(data.bandId, data.artistId),
    transaction,
    status: Constants.web3.transactionStatus.MINED
  }));
  store.dispatch(Actions.usm.refresh());
}

export function* updateActiveArtist() {
  // @TODO - for now, just set their first artist by default - do something smarter eventually
  const accountAddress = yield select(Selectors.web3.getAccountAddress);
  const artistEntities = yield select(Selectors.usm.selectAllArtistEntities);
  const activeArtistEntity = artistEntities.find((entity) => {
    return entity.owner === accountAddress;
  })

  if (activeArtistEntity) {
    yield put(Actions.usm.setActiveArtist({ artistTokenId: activeArtistEntity.tokenId }));
  }    
}