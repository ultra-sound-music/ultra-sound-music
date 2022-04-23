module.exports = {
  displayName: 'services-solanafm',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/services/solanafm',
  preset: '../../../jest.preset.ts'
};
