require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index'
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new FaviconsWebpackPlugin({
      logo: 'src/images/usmLogo.png',
      mode: 'auto',
      prefix: '',
      inject: true,
      cache: true
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: './',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      __GOOGLE_ANALYTICS_ENABLED__: JSON.stringify(
        process.env.GOOGLE_ANALYTICS_ENABLED === 'true'
      ),
      __GOOGLE_ANALYTICS_ID__: JSON.stringify(process.env.GOOGLE_ANALYTICS_ID),
      __ENVIRONMENT__: JSON.stringify(process.env.ENVIRONMENT),
      __SENTRY_ENABLED__: JSON.stringify(process.env.SENTRY_ENABLED === 'true'),
      __SENTRY_DSN__: JSON.stringify(process.env.SENTRY_DSN),
      __BLOCKCHAIN_NAME__: JSON.stringify(process.env.BLOCKCHAIN_NAME)
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true
    }),
    new ESLintPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'string-replace-loader',
        options: {
          search: '__BLOCKCHAIN_NAME__',
          replace: process.env.BLOCKCHAIN_NAME
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              modules: {
                mode: (resourcePath) => {
                  if (resourcePath.includes('/src/styles/')) {
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
        test: /\.svg/,
        type: 'asset/inline'
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3)$/,
        type: 'asset/resource'
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false // https://github.com/webpack/webpack/issues/11467
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@appComponents': path.resolve(__dirname, 'src/components'),
      '@constants$': path.resolve(__dirname, 'src/constants/index.js'),
      '@copy$': path.resolve(__dirname, 'src/copy/index.ts'),
      '@images': path.resolve(__dirname, 'src/images'),
      '@layouts$': path.resolve(__dirname, 'src/storybook/layouts.ts'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@uiComponents$': path.resolve(__dirname, 'src/storybook/components.ts'),
      '@uiTypes$': path.resolve(__dirname, 'src/storybook/types.ts'),
      '@utils$': path.resolve(__dirname, 'src/utils/index.js')
    },
    fallback: { crypto: false }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: true
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:9001'
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
