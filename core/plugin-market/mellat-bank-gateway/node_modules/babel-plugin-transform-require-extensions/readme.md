# babel-plugin-transform-require-extensions

[![npm version](https://badgen.net/npm/v/babel-plugin-transform-require-extensions)](https://npm.im/babel-plugin-transform-require-extensions) [![CI status](https://github.com/jaydenseric/babel-plugin-transform-require-extensions/workflows/CI/badge.svg)](https://github.com/jaydenseric/babel-plugin-transform-require-extensions/actions)

A [Babel](https://babeljs.io) plugin that transforms specified `require` path file extensions.

This is useful for building dual ESM/CJS packages. [File names with extensions are mandatory](https://nodejs.org/api/esm.html#esm_mandatory_file_extensions) in ESM `import` specifiers in `.mjs` files. After transpiling this to CJS in `.js` files, the hardcoded `.mjs` extensions in the `require` paths must be transformed to `.js`. Alternatively, sometimes it’s safe to remove the extensions as Node.js in CJS mode can automatically resolve `.js` file extensions.

## Setup

To install from [npm](https://npmjs.com) run:

```sh
npm install babel-plugin-transform-require-extensions --save-dev
```

Configure Babel to use the plugin:

```json
{ "plugins": ["transform-require-extensions"] }
```

This plugin must run after any ESM to CJS transpilation occurs.

By default `.mjs` extensions are transformed to `.js`. The `extensions` option can be used to specify extension replacements. For example, to remove `.mjs` extensions:

```json
{
  "plugins": [
    [
      "transform-require-extensions",
      {
        "extensions": {
          ".mjs": ""
        }
      }
    ]
  ]
}
```

## Support

- Node.js v10+
