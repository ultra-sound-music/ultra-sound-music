// require('dotenv').config({ path: 'apps/web/.env' });

// const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getDefaultConfig = require('@nrwl/react/plugins/webpack');

module.exports = (initialConfigs) => {
  const config = getDefaultConfig(initialConfigs);
  const inProductionMode = config.mode === 'production';

  config.module.rules = config.module.rules.filter((rule) => {
    // Find any default CSS & SCSS rules and remove them so
    // we can use our own in order to support css modules
    return !(
      rule.test.test('.css') ||
      rule.test.test('.scss') ||
      rule.test.test('.png')
    );
  });

  // Exclude any plugins that conflict with our setup
  config.plugins = config.plugins.filter((plugin) => {
    return (
      plugin?.constructor?.name !== 'HtmlWebpackPlugin' &&
      plugin?.constructor?.name !== 'MiniCssExtractPlugin' &&
      plugin?.constructor?.name !== 'IndexHtmlWebpackPlugin' &&
      plugin?.constructor?.name !== 'DefinePlugin'
    );
  });

  config.module.rules.push(
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        inProductionMode ? MiniCssExtractPlugin.loader : 'style-loader',

        // Translates CSS into CommonJS
        {
          loader: 'css-loader',
          options: {
            esModule: true,
            modules: {
              mode: (resourcePath) => {
                if (resourcePath.includes('global')) {
                  return 'global';
                }

                return 'local';
              },
              localIdentName: '[name]--[local]--[hash]',
              localIdentHashDigestLength: 5,
              exportLocalsConvention: 'asIs'
            }
          }
        },

        // Compiles Sass to CSS
        'sass-loader'
      ]
    },
    {
      test: /\.(jpg|jpeg|png|gif|mp3)$/,
      type: 'asset/resource'
    }
  );

  // PLUGINS
  const plugins = [
    new Dotenv({
      path: 'apps/web/.env',
      systemvars: !!inProductionMode
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true
    })
  ];

  if (inProductionMode) {
    plugins.push(new MiniCssExtractPlugin());
  }

  config.plugins = [...config.plugins, ...plugins];
  return config;
};
