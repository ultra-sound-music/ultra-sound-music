const TRUE = 'TRUE';

const mplAuctionPubKeys = process.env.MPL_AUCTION_PUBKEYS
  ? process.env.MPL_AUCTION_PUBKEYS.split(' ')
  : undefined;

const auctionOwner = process.env.AUCTION_OWNER ? process.env.AUCTION_OWNER : undefined;
const arweaveAddress = process.env.ARWEAVE_ADDRESS ? process.env.ARWEAVE_ADDRESS : undefined;
const arweaveHost = process.env.ARWEAVE_HOST ? process.env.ARWEAVE_HOST : undefined;
const arweavePort = process.env.ARWEAVE_PORT ? process.env.ARWEAVE_PORT : undefined;
const arweaveProtocol = process.env.ARWEAVE_PROTOCOL ? process.env.ARWEAVE_PROTOCOL : undefined;

export default {
  googleAnalyticsIsEnabled: process.env.USM_GOOGLE_ANALYTICS_ENABLED === TRUE,
  googleAnalyticsId: process.env.USM_GOOGLE_ANALYTICS_ID,
  sentryIsEnabled: process.env.USM_SENTRY_ENABLED === TRUE,
  sentryDNS: process.env.USM_SENTRY_DNS,
  solanaFMApiKey: process.env.USM_SOLANA_FM_API_KEY,
  solanaFMUri: process.env.USM_SOLANA_FM_URI,
  LFG: process.env.LFG === TRUE || undefined,
  solanaCluster: process.env.SOLANA_CLUSTER,
  arweaveAddress,
  mplAuctionPubKeys,
  auctionOwner,
  arweaveHost,
  arweavePort,
  arweaveProtocol
};
