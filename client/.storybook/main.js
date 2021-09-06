const commonConfigs = require('../webpack.common.js');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (defaultConfigs) => {
    const module = {
      ...defaultConfigs.module,
      rules: commonConfigs.module.rules
    };

    return { ...defaultConfigs, module };
  },
  core: {
    builder: 'webpack5'
  }
};
