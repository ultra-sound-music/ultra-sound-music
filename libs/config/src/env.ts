const TRUE = 'TRUE';

const mplAuctionPubKeys = process.env.MPL_AUCTION_PUBKEYS
  ? process.env.MPL_AUCTION_PUBKEYS.split(' ')
  : [];

export default Object.freeze({
  googleAnalyticsIsEnabled: process.env.USM_GOOGLE_ANALYTICS_ENABLED === TRUE,
  googleAnalyticsId: process.env.USM_GOOGLE_ANALYTICS_ID,

  sentryIsEnabled: process.env.USM_SENTRY_ENABLED === TRUE,
  sentryDNS: process.env.USM_SENTRY_DNS,

  solanaFMApiKey: process.env.USM_SOLANA_FM_API_KEY,
  solanaFMUri: process.env.USM_SOLANA_FM_URI,

  weAreLive:
    process.env.WE_ARE_LIVE === TRUE && process.env.SOLANA_CLUSTER && mplAuctionPubKeys.length,

  solanaCluster: process.env.SOLANA_CLUSTER,
  mplAuctionPubKeys,
  mplStorePubKey: process.env.MPL_STORE_PUBKEY
});
