const path = require('path')

module.exports = {
  target: 'node',
  entry: {
    main: path.resolve(__dirname, 'src/main.ts')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'main.js',
    libraryTarget: 'commonjs',
  },
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