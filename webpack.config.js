const path = require('path');

const build_dir = path.join(__dirname, 'build');

module.exports = {
  entry: './src/knockout-jsonapi-utils.js',
  output: {
    filename: 'knockout-jsonapi-utils.js',
    path: build_dir,
    library: 'KnockoutJsonApiUtils',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  externals: {
    knockout: {
      root: "ko",
      commonjs: "knockout",
      commonjs2: "knockout",
      amd: "knockout"
    },
    moment: "moment"
  }
};
