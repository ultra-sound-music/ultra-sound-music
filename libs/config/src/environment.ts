import defaults from './defaults';

const configs = {
  production: false,
  env: 'local',
  build: 'development'
};

export default {
  ...defaults,
  ...configs
};
