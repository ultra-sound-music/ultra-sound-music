// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.
import defaults from './defaults';

const TRUE = 'TRUE';

const env = {
  googleAnalyticsIsEnabled: process.env.USM_GOOGLE_ANALYTICS_ENABLED === TRUE,
  googleAnalyticsId: process.env.USM_GOOGLE_ANALYTICS_ID,
  sentryIsEnabled: process.env.USM_SENTRY_ENABLED === TRUE,
  sentryDNS: process.env.USM_SENTRY_DNS,
  solanaFMApiKey: process.env.USM_SOLANA_FM_API_KEY,
  solanaFMUri: process.env.USM_SOLANA_FM_URI,
  weAreLive: process.env.WE_ARE_LIVE === TRUE
};

const configs = {
  production: false,
  build: 'development',
  environment: 'local'
};

export default {
  ...defaults,
  ...configs,
  ...env
};
