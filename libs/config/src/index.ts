import defaults from './defaults';
import environmentConfigs from './environment';
import envVariables from './env';

export * from './errors';

export default {
  ...defaults,
  ...environmentConfigs,
  ...envVariables
};
