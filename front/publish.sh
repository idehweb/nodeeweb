#!/bin/bash
set -e

echo "## Copy pakcage.build.json ##"
cp package.build.json build/package.json

cd build

npm publish --access public