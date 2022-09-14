var path = require('path');

 module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '../dist/es6/formkiq-client-sdk-es6.js',
    library: {
      name: 'formkiq-client-sdk',
      type: 'umd2',
      export: 'FormkiqClient',
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