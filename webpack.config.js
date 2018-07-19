const webpack = require('webpack');

const name = 'app';

const DEV = process.env.NODE_ENV !== 'production';
const filename = DEV ? `${name}.js` : `${name}.min.js`;

module.exports = {
  entry: __dirname + '/web.js',
  output: {
    path: __dirname + '/dist/assets',
    filename,
  },
  module: {
    loaders: [],
  },
  plugins: DEV ? [] : [
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
