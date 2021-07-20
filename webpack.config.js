const path = require('path');

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: {
    main: path.resolve(__dirname, 'src/main.ts'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    'main.js.map': 'main.js.map',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        // Exclude: /node_modules/
      },
    ],
  },
};
