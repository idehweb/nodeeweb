const { join } = require('path');

module.exports = {
  entry: './index.ts',
  mode: 'production',
  target: 'node',
  output: {
    filename: 'bundle.js',
    clean: true,
    path: join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  optimization: {
    minimize: false,
  },
};
