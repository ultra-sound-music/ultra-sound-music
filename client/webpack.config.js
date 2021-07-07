const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

module.exports = (env) => {
  return {
    mode: 'development',
    entry: {
      index: './src/index'    
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html'
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
            replace: env.BLOCKCHAIN_NAME,
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
    }
  }
};