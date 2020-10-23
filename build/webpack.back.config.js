var path = require('path');
var webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

 module.exports = {
  target: "node",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '../dist/es6-backend/formkiq-client-sdk-node.js',
    library: "formkiqClient",
    libraryTarget: "umd"
  },
  resolve: {
    alias: {
      'node-localstorage': 'node-localstorage'
    }
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
  stats: {
    colors: true
  }
};