const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TransformRequireExtensions = require('babel-plugin-transform-require-extensions');
const { use } = require('passport');

module.exports = {
  mode: 'production',
  entry: './index.ts',
  // node: {
  //   __dirname: false,
  //   __filename: false,
  // },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // exclude: [/dto/],
        use: 'ts-loader',
      },
      // {
      //   test: /\.ejs$/,
      //   use: ['ejs-compiled-loader'],
      // },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [TransformRequireExtensions],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.ejs'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // exclude: /dto/,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  devtool: 'source-map',
  target: 'node18',
  plugins: [new HtmlWebpackPlugin()],
};
