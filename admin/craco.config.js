// @ts-check
const path = require('path');

const gitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

const now = new Date().toISOString();
process.env.REACT_APP_VERSION = now + ', ' + gitHash;

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  eslint: {
    enable: isDev,
  },
  webpack: {
    alias: {
      '#c': path.resolve(__dirname, 'src/'),
      '@': path.resolve(__dirname, 'src/'),
    },
    configure: (
      /** @type {import('webpack/types').Configuration} */
      webpackConfig,
      { env }
    ) => {
      if (env === 'development') return webpackConfig;

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
