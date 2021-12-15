import { call, select } from 'redux-saga/effects';

import utils from '@utils';
import EthUsmClient from '@lib/EthUsmClient';
import mediator from '@usm/store/mediator';

export function* createUsmClient({ web3Client: ethClient }) {
  // @todo optimize this loading to be async and not block the app
  const {
    default: { artist: artistConfig, band: bandConfig, track: trackConfig },
  } = yield call(() => import('../../../../deps/tokenConfigs'));

  return new EthUsmClient({
    artistConfig,
    bandConfig,
    trackConfig,
    accountAddress: yield select(mediator.selectors.getAccountAddress),
    apiHost: `//${document.location.host}`,
    provider: ethClient.provider,
    logger: utils.logger,
  });
}
