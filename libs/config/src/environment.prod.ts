import defaults from './defaults';

const configs = {
  production: true,
  env: 'prod',
  build: 'production'
};

export default {
  ...defaults,
  ...configs
};
