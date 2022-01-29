import defaults from './defaults';

const configs = {
  production: false,
  build: 'development',
  environment: 'dev'
};

export default {
  ...defaults,
  ...configs
};
