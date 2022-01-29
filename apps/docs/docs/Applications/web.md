# Web Client

### Setup

Install [nvm](https://github.com/nvm-sh/nvm)

Install [node](https://github.com/nvm-sh/nvm#nvmrc) with `nvm use`

Install [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) with `npm install -g yarn`

Install [NX CLI](https://nx.dev/l/r/using-nx/nx-cli) with `yarn global add nx` (optional)

Install all dependencies with `yarn install`

### Serve Web Application

```
nx serve web

// or, you can specify a configuration:
nx serve web --configuration=stage
```

### Run Unit Tests

```
nx test web
```

### Build

```
nx build web

// or, you can specify a configuration:
nx build web --configuration=stage
```
