#!/usr/bin/env bash
set -e
# ln-relative.sh /app/public/files ../front/index.html index.html

root=$1
src=$2
dist=$3

cd "$root"
ln -s "$src" "$dist"

exit 0