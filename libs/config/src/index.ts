import merge from 'lodash/merge';

import build from './build';
import defaults from './defaults';
import environmentConfigs from './environment';
import envVariables from './env';

export * from './errors';

const { app, apps, ...configs } = merge(defaults, build, environmentConfigs);
const appConfigs = apps[app as 'guillermo' | 'web'];
const combinedConfigs = merge(configs, appConfigs, envVariables);

// OVERRIDES - NOT EVEN ENV VARS CAN HELP YOU NOW...
// This setting is here for the auction site - just to make sure we don't accidentally turn on the auction and forget to enable Solana
if (combinedConfigs.LFG === true) {
  combinedConfigs.solana = true;
}

export default combinedConfigs;
