#!/bin/bash

set -e

# ./backup.sh {mongo_uri} {result_path}

mkdir -p ./temp

# Dump Mongodb
mongodump --uri $1 --out ./temp

# Tar
tar -cvzpf $2 ./temp/* 

# Split into files
split -b 40M $2 "$2.part"

rm -r ./temp

exit 0;
