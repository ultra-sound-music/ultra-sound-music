const common = require('./webpack.common.js');
const path = require('path');
const { merge } = require('webpack-merge');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
    }
  });
};
