#!/bin/bash
set -e

echo "## Copy pakcage.build.json ##"
ls -alh

ls build -alh

cp package.build.json build/package.json

cd build

npm publish --access public