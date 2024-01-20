const { join } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const distPath = join(__dirname, 'dist');

module.exports = {
  entry: './index.ts',
  mode: 'production',
  target: 'node',
  // devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    clean: true,
    path: distPath,
    library: {
      type: 'commonjs2',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 'current',
                    },
                  },
                ],
              ],
            },
          },
          'ts-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  optimization: {
    // minimize: false,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/**/templates/*.ejs',
          to: join(distPath, 'templates', '[name][ext]'),
        },
      ],
    }),
  ],
};
