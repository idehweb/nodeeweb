#!/bin/bash
set -e

echo "## Copy package.build.json ##"
cp package.build.json build/package.json

cd build

npm publish --access public