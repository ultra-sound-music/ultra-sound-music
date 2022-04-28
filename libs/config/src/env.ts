const TRUE = 'TRUE';

const mplAuctionPubKeys = process.env.MPL_AUCTION_PUBKEYS
  ? process.env.MPL_AUCTION_PUBKEYS.split(' ')
  : undefined;

const auctionOwner = process.env.AUCTION_OWNER ? process.env.AUCTION_OWNER : undefined;
const arweaveAddress = process.env.ARWEAVE_ADDRESS ? process.env.ARWEAVE_ADDRESS : undefined;
const arweaveHost = process.env.ARWEAVE_HOST ? process.env.ARWEAVE_HOST : undefined;
const arweavePort =
  typeof process.env.ARWEAVE_PORT === 'string' ? process.env.ARWEAVE_PORT : undefined;
const arweaveProtocol = process.env.ARWEAVE_PROTOCOL ? process.env.ARWEAVE_PROTOCOL : undefined;
const governanceProgram = process.env.USM_GOVERNANCE_PROGRAM
  ? process.env.USM_GOVERNANCE_PROGRAM
  : undefined;
const jamBotsGovernance = process.env.USM_JAM_BOTS_GOVERNANCE
  ? process.env.USM_JAM_BOTS_GOVERNANCE
  : undefined;
const daoTreasury = process.env.USM_DAO_TREASURY ? process.env.USM_GOVERNANCE_ACCOUNT : undefined;
const councilToken = process.env.USM_COUNCIL_TOKEN ? process.env.USM_COUNCIL_TOKEN : undefined;

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
  arweaveProtocol,
  governanceProgram,
  jamBotsGovernance,
  daoTreasury,
  councilToken
};
