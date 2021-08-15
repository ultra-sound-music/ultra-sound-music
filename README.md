# Ultra Sound Music

## Quick Start

1. Install MongoDB

```
brew tap mongodb/brew
brew install mongodb-community@4.4
```

2. Create .env file inside of the `/api` folder and populate it with environment variables (see `.env.example`).

3. Run setup scripts
```
npm run start-blockchain

// Then, open another terminal
npm run start-api

// Then, open a third terminal
npm run deploy-contracts
npm run seed-chain-data
npm run start-client
```

## Client

```
cd client

npm i

npm run start

```

## Contracts

code located in `/contracts`

```
cd contracts

npm i

// compiles test ERC20 contract

npx hardhat compile

// deploys ERC20 contract to local running network

npx hardhat run scripts/sample-deploy.js

// runs local network and exposes JSON-RPC server at http://127.0.0.1:8545/

npx hardhat node

```

## Server

create a `.env` file following the example in `.env.example`

to run locally you must mongodb installed and run `mongod` to get a local instance running

```
cd api

npm i

npm run start
```

endpoint

```
/cache/artists
/cache/bands
/cache/tracks
/cache/tokens/all
/create_metadata_uri
```

```

```
