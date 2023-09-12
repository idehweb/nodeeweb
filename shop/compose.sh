#!/bin/bash
# ./compose.sh dev -d
set -aux
args=($@)
git pull
cd ..
docker compose -f shop/${1:-dev}.compose.yml down --rmi all
docker compose -f shop/${1:-dev}.compose.yml up ${args[@]:1}