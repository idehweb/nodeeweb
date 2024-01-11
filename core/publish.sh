#!/bin/bash
set -e

cd dist

# set env
npm config set registry https://registry.npmjs.org/
npm config set "//registry.npmjs.org/:_authToken"=$NODE_AUTH_TOKEN

npm publish --access public