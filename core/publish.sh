#!/bin/bash
set -e

cd dist
echo "cd to dist"

# set env
npm config set registry https://registry.npmjs.org/
npm config set "//registry.npmjs.org/:_authToken"=$NODE_AUTH_TOKEN

echo "set envs"

npm publish --access public

echo "publish done"
exit 0