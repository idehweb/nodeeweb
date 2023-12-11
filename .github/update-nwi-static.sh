#!/bin/bash

set -e
# update-nwi-static.sh {static-type} {source path}

type=$1
source_path=$2

echo "received $type from $source_path"

services=$(ls /var/instances/*/ -d | grep nwi-)

for service in ${services[@]}
do
    dist_path="${service}public/$type"

    if [ ${source_path::-1} != $dist_path ]
    then
      # rm static
      rm -fr $dist_path/*
      echo "remove static $type for $service"

      # copy static
      cp -r ${source_path}* $dist_path
      echo "copy static $type for $service"
    fi
done