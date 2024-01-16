// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts', // your entry point
  output: {
    file: 'dist/bundle.js', // the output bundle
    format: 'cjs',
  },
  plugins: [
    resolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module
    typescript(), // so Rollup can process your TypeScript files
  ],
};
