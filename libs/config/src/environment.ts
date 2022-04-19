// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

// Use this object as the whitelist of available props that Typescript can infer from
export default {
  production: false,
  build: 'development',
  environment: 'local',
  solanaCluster: 'some-string',
  auctionOwner: 'auction owner wallet address',
  mplAuctionPubKeys: ['array of auction account addresses']
};
