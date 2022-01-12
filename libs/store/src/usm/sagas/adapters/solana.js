import { select } from 'redux-saga/effects';

import SolUsmClient from '@lib/SolUsmClient';
import utils from '@utils';
import mediator from '@usm/store/mediator';

export function* createUsmClient({ web3Client: solClient }) {
  return new SolUsmClient({
    solClient,
    accountAddress: yield select(mediator.selectors.getAccountAddress),
    logger: utils.logger
  });
}
