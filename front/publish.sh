#!/bin/bash
set -e

echo "## Copy package.build.json ##"

cp package.build.json build/package.json

cd build

# set env
npm config set registry https://registry.npmjs.org/
npm config set "//registry.npmjs.org/:_authToken"=$NODE_AUTH_TOKEN


npm publish --access public