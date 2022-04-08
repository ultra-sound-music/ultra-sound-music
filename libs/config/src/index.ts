import merge from 'lodash/merge';

import build from './build';
import defaults from './defaults';
import environmentConfigs from './environment';
import envVariables from './env';

export * from './errors';

const { app, apps, ...configs } = merge(defaults, build, environmentConfigs);

const appConfigs = apps[app as 'guillermo' | 'web'];
const combinedConfigs = {
  ...configs,
  ...appConfigs,
  ...envVariables
};

// OVERRIDES - NOT EVEN ENV VARS CAN HELP YOU NOW...
// This setting is here for the auction site - do not load Solana if we are not live with the auction.
if (combinedConfigs.weAreLive === false) {
  combinedConfigs.solana = false;
}

export default combinedConfigs;
