#!/bin/bash

set -aux

git pull
cd ..
docker compose -f shop/compose.yml down --rmi all
docker compose -f shop/compose.yml up $@