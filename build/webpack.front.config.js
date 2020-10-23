var path = require('path');
var webpack = require('webpack');

 module.exports = {
  target: "web",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '../dist/es6-frontend/formkiq-client-sdk-es6.js',
    library: "formkiqClient",
    libraryTarget: "umd"
  },
  resolve: {
    alias: {
      'node-localstorage': false
    }
  },
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
  },
  devtool: 'source-map'
};