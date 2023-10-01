// @ts-check
const path = require('path');

const gitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

const now = new Date().toISOString();
process.env.REACT_APP_VERSION = now + ', ' + gitHash;

const isDev = process.env.NODE_ENV === 'development';

/** @type { import("@craco/types").CracoConfig } */
const config = {
  eslint: {
    enable: isDev,
  },
  webpack: {
    alias: {
      '#c': path.resolve(__dirname, 'src/'),
      '@': path.resolve(__dirname, 'src/'),
    },
    configure: (webpackConfig, { env }) => {
      if (env === 'development') return webpackConfig;

      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        runtimeChunk: 'single',
        usedExports: true,
        providedExports: true,
        splitChunks: {
          chunks: 'all',
          minSize: 50000,
        },
      };

      if (process.env.ANALYZE) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

        // @ts-ignore
        webpackConfig.plugins.push(
          // @ts-ignore
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
