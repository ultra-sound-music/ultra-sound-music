export default {
  production: true,
  environment: 'prod',
  build: 'production',

  apps: {
    guillermo: {
      solana: true,
      arweave: true
    },

    web: {
      solana: true,
      arweave: false
    }
  }
};
