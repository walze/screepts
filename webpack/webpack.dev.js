const path = require('path');

const {
  prod_Path,
  src_Path
} = require('./path');

module.exports = {
  target: 'node',
  entry: {
    main: './' + src_Path + '/main.ts'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, prod_Path),
    filename: 'main.js',
    libraryTarget: 'commonjs',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        // exclude: /node_modules/
      }
    ]
  },
  // optimization: {
    // runtimeChunk: true,
  // },
  plugins: [
  ]
};