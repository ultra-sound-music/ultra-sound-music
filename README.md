# UltraSoundMusic

This project was generated using [Nx](https://nx.dev).

## Running the web application

### Basic setup

1. clone repo
2. yarn install
3. nx serve

### Enable auctions

1. Add an .env file under `apps/web`
2. Add `LFG=TRUE` to your .env file.
3. restart the NX server

### Run your own auctions

1. Do the steps above to run the auction site
2. Add the address to your auctions to the .env file to override the default auctions:
   ```
   MPL_AUCTION_PUBKEYS="<auction1-address> <auction2-address> etc..."
   ```
3. restart the NX server

## Development

### Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application. See the [docs](https://nx.dev/generators/using-schematics) for more details.

Note. With Nx you can create multiple applications and libraries in the same workspace.

### Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

Libraries are shareable across libraries and applications. They can be imported from `@usm/<name-of-your-library>`.

See the [docs](https://nx.dev/generators/using-schematics) for more details.

### Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

### Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
