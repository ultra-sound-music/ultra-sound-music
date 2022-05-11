export default {
  production: true,
  build: 'production',
  environment: 'prod',

  solanaRpc: 'devnet',

  apps: {
    web: {
      solana: true,
      arweave: false,
      LFG: false,
      auctionOwner: '',
      mplAuctionPubKeys: []
    },

    guillermo: {
      solana: true,
      arweave: true,
      mplAuctionPubKeys: [],
      arweaveProtocol: 'https',
      arweaveHost: 'arweave.net',
      arweavePort: '',
      auctionOwner: '6ckMb1fXrELfqNJxKUFATfE1LM5wJxUmcpmGWEj91fY2',
      jamBotsGovernance: '6ckMb1fXrELfqNJxKUFATfE1LM5wJxUmcpmGWEj91fY2',
      daoTreasury: '75GTki3UNuH2tRQeUwEsGCs4cP7dKxryjZZUgvH4Wo6'
    }
  }
};
