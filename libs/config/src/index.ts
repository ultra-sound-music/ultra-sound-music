import defaults from './defaults';
import environmentConfigs from './environment';
import envVariables from './env';

export default {
  ...defaults,
  ...environmentConfigs,
  ...envVariables
};
