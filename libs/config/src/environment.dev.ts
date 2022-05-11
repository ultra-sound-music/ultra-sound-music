export default {
  production: false,
  build: 'development',
  environment: 'dev',
  solanaRpc: 'https://mango.devnet.rpcpool.com',
  auctionOwner: 'At3TUERJEqU5CE8ipb7v7LuLtTQ5ZoGK8ELij9bSFNPU',
  mplAuctionPubKeys: [
    '7qSVDA7vXZ5DDus65SEJP8YuMzq5zpiU4g9iWxhfHmpZ',
    '8xUYLXSwjzgAQdnL7D9sPL2kUb8h57CdpqpYsRQYQoso'
    // '@TODO - CREATE ONE MORE AUCTION'
  ],

  apps: {
    guillermo: {
      solana: true,
      arweave: true,
      arweaveProtocol: 'https',
      arweaveHost: 'arweave.net',
      arweavePort: '',
      auctionOwner: '6ckMb1fXrELfqNJxKUFATfE1LM5wJxUmcpmGWEj91fY2',
      jamBotsGovernance: '6ckMb1fXrELfqNJxKUFATfE1LM5wJxUmcpmGWEj91fY2',
      daoTreasury: '75GTki3UNuH2tRQeUwEsGCs4cP7dKxryjZZUgvH4Wo6'
    }
  }
};
