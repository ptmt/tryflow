var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './app/client/app.js'
  ],

  output: {
    // Where to put build results when doing production builds:
    // (Server doesn't write to the disk, but this is required.)
    path: __dirname ,

    // Filename to use in HTML
    filename: './dist/scripts/app.js',

    // Path to use in HTML
  //  publicPath: 'http://localhost:9001/scripts/'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
    //new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js')
  ],

  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ['', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?stage=0'],
        include: path.join(__dirname, 'app/client')
      }
    ]
  },
};
