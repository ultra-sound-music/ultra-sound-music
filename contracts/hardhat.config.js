require('@nomiclabs/hardhat-ethers');

module.exports = {
  hardhat: {
    chainId: 1337
  },
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  rinkeby: {
    url: 'https://eth-mainnet.alchemyapi.io/v2/123abc123abc123abc123abc123abcde'
    //accounts: [privateKey1, privateKey2, ...]
  }
};
