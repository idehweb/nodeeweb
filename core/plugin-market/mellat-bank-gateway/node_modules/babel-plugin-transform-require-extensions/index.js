'use strict';

/**
 * A Babel plugin that replaces specified require path file extensions.
 * @param {object} babel Current Babel object.
 * @param {object} [options] Plugin options.
 * @param {object.<string, string>} [options.extensions={'.mjs': '.js'}] A map of require path file extensions and their replacements.
 * @returns {object} Babel plugin object.
 */
module.exports = function babelPluginTransformRequireExtensions(
  babel,
  { extensions = { '.mjs': '.js' } }
) {
  return {
    name: 'transform-require-extensions',
    visitor: {
      CallExpression(path) {
        if (path.node.callee.name === 'require') {
          const [specifier] = path.node.arguments;
          if (specifier && specifier.type === 'StringLiteral')
            for (const extension in extensions) {
              const regExp = new RegExp(`${extension}$`);
              if (regExp.test(specifier.value)) {
                specifier.value = specifier.value.replace(
                  regExp,
                  extensions[extension]
                );
                break;
              }
            }
        }
      },
    },
  };
};
