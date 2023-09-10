#!/bin/bash

set -e

# ./backup.sh {mongo_uri} {result_path}

echo "start backup"

mkdir -p ./temp

# Dump Mongodb
mongodump --uri $1 --out ./temp --quiet
echo "mongodump successfully"

# Tar
tar -cvzpf $2 ./temp/* 1>/dev/null
echo "tar complete"

# Split into files
split -b 40M $2 "$2.part"
echo "split complete"

rm -r ./temp

exit 0;
