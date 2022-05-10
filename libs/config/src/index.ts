import merge from 'lodash/merge';

import build from './build';
import defaults from './defaults';
import environmentConfigs from './environment';
import envVariables from './env';

export * from './errors';

const { app, apps, ...configs } = merge(defaults, build, environmentConfigs);
const appConfigs = apps[app as 'guillermo' | 'web'];
const combinedConfigs = merge(configs, appConfigs, envVariables);

// Make sure the entire array is replaced as apposed to merged
if (envVariables.mplAuctionPubKeys) {
  combinedConfigs.mplAuctionPubKeys = envVariables.mplAuctionPubKeys;
}

// OVERRIDES - NOT EVEN ENV VARS CAN HELP YOU NOW...
// This setting is here for the auction site - just to make sure we don't accidentally turn on the auction and forget to enable Solana
if (combinedConfigs.LFG === true) {
  combinedConfigs.solana = true;
} else {
  combinedConfigs.solana = false;
}

export default { ...combinedConfigs } as const;
