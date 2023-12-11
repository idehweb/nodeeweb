#!/bin/bash

set -e
# update.nwi.sh {static-type} {source path}

type=$1
source_path=$2

echo "received $type from $source_path"

services=$(docker service ls --format "{{.Name}}" | grep nwi-)

for service in ${services[@]}
do
    dist_path="/var/instances/$service/public/$type"

    # rm static
    rm -fr $dist_path/*
    echo "remove static $type for $service"

    # copy static
    cp -r "$source_path*" $dist_path 
    echo "copy static $type for $service"
done