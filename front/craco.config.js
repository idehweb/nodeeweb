// @ts-check
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const gitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

const now = new Date().toISOString();
process.env.REACT_APP_VERSION = now + ', ' + gitHash;

const isDev = process.env.NODE_ENV === 'development';
const JsBasePath = 'static/js';

/** @type { import("@craco/types").CracoConfig } */
const config = {
  eslint: {
    enable: isDev,
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '#c': path.resolve(__dirname, 'src/'),
    },
    configure: (webpackConfig, { env }) => {
      if (env === 'development') return webpackConfig;

      webpackConfig.output = {
        ...webpackConfig.output,
        chunkFilename: `${JsBasePath}/[name].bundle.js?h=[chunkhash]`,
      };

      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        runtimeChunk: 'single',

        splitChunks: {
          chunks: 'all',
          minSize: 500000,

          cacheGroups: {
            defaultVendors: {
              filename: `${JsBasePath}/bundle.js?h=[chunkhash]`,
              priority: -100,
            },
            'material-icons': {
              test: /[\\/]node_modules[\\/]@mui[\\/]icons-material[\\/]/,
              filename: `${JsBasePath}/material-icons.js?h=[chunkhash]`,
              priority: -10,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              filename: `${JsBasePath}/vendors.js?h=[chunkhash]`,
              priority: -50,
            },
            json: {
              test: /\.json$/i,
              filename: `${JsBasePath}/data.json`,
              priority: -20,
            },
          },
        },
      };

      // @ts-ignore
      webpackConfig.plugins[5] = new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/bundle.css?h=[chunkhash]',
        chunkFilename: 'static/css/[name].chunk.css?h=[chunkhash]',
      });
      // webpackConfig.plugins.push(
      //   new webpack.optimize.LimitChunkCountPlugin({
      //     maxChunks: 1,
      //   })
      // );
      if (process.env.ANALYZE) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

        // @ts-ignore
        webpackConfig.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: true,
          }),
          // @ts-ignore
          new DuplicatePackageCheckerPlugin()
        );
      }

      return webpackConfig;
    },
  },
  babel: {
    plugins: isDev
      ? []
      : [['transform-remove-console', { exclude: ['error', 'warn'] }]],
  },
};

module.exports = config;
