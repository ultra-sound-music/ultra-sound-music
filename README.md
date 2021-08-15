# Ultra Sound Music

## Quick Start

1. Install MongoDB

```
brew tap mongodb/brew
brew install mongodb-community@4.4
```

2. Setup local environment
  * Create .env file inside of the `/api` folder and populate it with api environment variables (see `.env.example`).
  * Create .env file inside of the `/client` folder and populate it with client environment variables

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

## Debugging the ExpressJS Server

1. Upon setup, instead of running `npm run start-api`, you do:
```
cd api
npm run start-debug
```

2. Continue with the rest of the setup scripts as usual.

3. In Chrome, navigate to `chrome://inspect`

4. Click the `inspect` link under the `Remote Target` heading.

5. You can now open expressjs files from within Chrome and set breakpoints.

## Enabled 3rd Party integrations

Set the `<SERVICE>_ENABLED` environment variable for the given service to `'true'`
