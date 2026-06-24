export default {
  production: true,
  environment: 'prod',
  build: 'production',

  apps: {
    guillermo: {
      solana: true,
      arweave: true,
      arweaveHost: 'arweave.net',
      arweaveProtocol: 'https'
    },

    web: {
      solana: true,
      arweave: false
    }
  }
};
