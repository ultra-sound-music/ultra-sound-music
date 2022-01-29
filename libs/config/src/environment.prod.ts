import defaults from './defaults';

const configs = {
  production: true,
  build: 'production',
  environment: 'prod'
};

export default {
  ...defaults,
  ...configs
};
