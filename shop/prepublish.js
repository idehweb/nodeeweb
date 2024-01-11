const fs = require('fs');
const { join } = require('path');

const buildPackagePath = join(__dirname, 'dist', 'package.json');
const corePackagePath = join(__dirname, '..', 'core', 'package.json');

const buildPackage = require(buildPackagePath);
const corePackage = require(corePackagePath);

// change nodeeweb-core version
buildPackage['dependencies']['@nodeeweb/core'] = `^${corePackage.version}`;

// write
fs.writeFileSync(buildPackagePath, JSON.stringify(buildPackage, null, '    '), {
  encoding: 'utf8',
});
