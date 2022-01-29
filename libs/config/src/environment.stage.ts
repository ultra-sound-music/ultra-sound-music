import defaults from './defaults';

const configs = {
  production: true,
  build: 'production',
  environment: 'stage'
};

export default {
  ...defaults,
  ...configs
};
