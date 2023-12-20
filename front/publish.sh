#!/bin/bash
set -e

echo "## Copy package.build.json ##"

cp package.build.json build/package.json

cd build

# set env
npm config set _authToken=$NODE_AUTH_TOKEN
npm config set registry https://registry.npmjs.org/


npm publish --access public