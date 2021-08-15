require('dotenv').config();
const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

module.exports = {
  entry: {
    index: './src/index'    
  },
  plugins: [
    new webpack.DefinePlugin({
      __GOOGLE_ANALYTICS_ENABLED__: JSON.stringify(process.env.GOOGLE_ANALYTICS_ENABLED === 'true'),
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
          replace: process.env.BLOCKCHAIN_NAME,
        }
      },        
      {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          use: ['file-loader']
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    plugins: [
      new DirectoryNamedWebpackPlugin({
        honorIndex: true
      })           
    ],
    fallback: {
      util: require.resolve("util/")
    }    
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    proxy: {
      '/api': 'http://localhost:9001',
    },      
  }
}