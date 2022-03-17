const TRUE = 'TRUE';

export default Object.freeze({
  googleAnalyticsIsEnabled: process.env.USM_GOOGLE_ANALYTICS_ENABLED === TRUE,
  googleAnalyticsId: process.env.USM_GOOGLE_ANALYTICS_ID,

  sentryIsEnabled: process.env.USM_SENTRY_ENABLED === TRUE,
  sentryDNS: process.env.USM_SENTRY_DNS,

  solanaFMApiKey: process.env.USM_SOLANA_FM_API_KEY,
  solanaFMUri: process.env.USM_SOLANA_FM_URI,

  weAreLive: process.env.WE_ARE_LIVE === TRUE,

  solanaCluster: process.env.SOLANA_CLUSTER,
  auctionPubKey: process.env.MPL_AUCTION_PUBKEY
});