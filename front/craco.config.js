const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const gitHash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

const now = new Date().toLocaleString('en-us');
process.env.REACT_APP_VERSION = now + ', ' + gitHash;

module.exports = {
  webpack: {
    alias: {
      '#c': path.resolve(__dirname, 'src/'),
    },
    configure: (webpackConfig, {env, paths}) => {
      if (env === 'development') return webpackConfig;
      webpackConfig.output = {
        ...webpackConfig.output,
        filename: 'static/js/bundle.js',
        chunkFilename: 'static/js/[name].chunk.js',
      };
      // webpackConfig.optimization = {
      //   ...webpackConfig.optimization,
      //
      //   // runtimeChunk:'single',
      //   splitChunks: {
      //     name: true,
      //   },
      // };
      console.log('webpackConfig.plugins', webpackConfig.optimization);

      // webpackConfig.plugins.map((plugin,i)=>{
      //   // if(JSON.stringify(plugin).indexOf('MiniCssExtractPlugin')>0){
      //     console.log('hi',JSON.stringify(plugin)+'\n\n\n\n')
      //   // }
      // })
      webpackConfig.plugins[5] =
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/bundle.css',
          chunkFilename: 'static/css/[name].chunk.css',
        });
      webpackConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }))

      // console.log('akbar => ', webpackConfig.optimization);
      return webpackConfig;
    }

  },

};
