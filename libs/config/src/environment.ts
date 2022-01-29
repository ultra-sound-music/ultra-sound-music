// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.
import defaults from './defaults';

const configs = {
  production: false,
  build: 'development',
  environment: 'local'
};

export default {
  ...defaults,
  ...configs
};
