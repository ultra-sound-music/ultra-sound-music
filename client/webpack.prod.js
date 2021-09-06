const { merge } = require('webpack-merge');
const common = require('./webpack.common');

// Use this for production
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map'
});
