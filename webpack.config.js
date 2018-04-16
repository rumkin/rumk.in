const webpack = require('webpack');

const name = 'app';
// const exportVar = 'TypedProps';

const DEV = process.env.NODE_ENV !== 'production';
const filename = DEV ? `${name}.js` : `${name}.min.js`;

module.exports = {
  entry: __dirname + '/web.js',
  output: {
    path: __dirname + '/dist',
    filename,
    // library: exportVar,
  },
  module: {
    loaders: [
        {
          // test: /\.js$/,
          //   loader: 'babel-loader',
          //   query: {
          //       // presets: ['es2015'],
          //       plugins: [
          //         // ['transform-object-rest-spread', {'useBuiltIns': true}],
          //       ],
          //   },
        },
    ],
  },
  plugins: DEV ? [] : [
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
