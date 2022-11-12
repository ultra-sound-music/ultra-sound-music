/* eslint-disable */
export default {
  displayName: 'ui',

  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/ui',
  preset: '../../jest.preset.js'
};
