import defaults from './defaults';

const configs = {
  production: true,
  env: 'dev',
  build: 'production' // we want a "production" build when deploying to a remote server
};

export default {
  ...defaults,
  ...configs
};
