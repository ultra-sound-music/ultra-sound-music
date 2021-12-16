module.exports = {
  displayName: 'wallets-sol-wallet',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { cwd: __dirname }],
  },
  transformIgnorePatterns: [
    "<rootDir>node_modules/"
  ],  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/wallets/sol-wallet',
};
