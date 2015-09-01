var path    = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.js'
    },
    module: {
        loaders: [
            {test: path.join(__dirname, 'src'), loader: 'babel-loader'}
        ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ],
    stats: {
      colors: true
    },
    devtool: 'source-map'
};
