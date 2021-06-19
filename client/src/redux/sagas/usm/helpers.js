import * as ReduxUtils from '../../utils';
import * as Actions from '../../actions';
import * as Constants from '../../../constants';

export function onCreateArtistComplete({ metadata, transaction }) {
  const store = ReduxUtils.getStore();
  store.dispatch(Actions.web3.updateTransaction({
    key: metadata.artistDNA,
    transaction,
    status: Constants.web3.transactionStatus.MINED
  }));
}

export function onCreateBandComplete({ metadata, transaction }) {
  const store = ReduxUtils.getStore();
  store.dispatch(Actions.web3.updateTransaction({
    key: metadata.bandLeaderTokenId,
    transaction,
    status: Constants.web3.transactionStatus.MINED
  }));  
}