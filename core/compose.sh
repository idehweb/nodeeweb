#!/bin/bash

set -aux

git pull
docker compose -f compose.yml down --rmi all
docker compose -f compose.yml up $@