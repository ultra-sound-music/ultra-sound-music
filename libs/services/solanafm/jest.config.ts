/* eslint-disable */
export default {
  displayName: 'services-solanafm',

  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/services/solanafm',
  preset: '../../../jest.preset.js'
};
