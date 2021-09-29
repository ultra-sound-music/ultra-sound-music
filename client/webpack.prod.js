const { mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const merge = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'replace'
    }
  }
});

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              modules: {
                mode: 'local',
                localIdentName: '[hash:base64]',
                exportLocalsConvention: 'asIs'
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
});
