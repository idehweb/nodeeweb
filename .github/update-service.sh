#!/bin/bash
# root path: /
set -e
# 1: tag
# 2: service name
service_arr=($2)
for service in ${service_arr[@]}
do
    echo try to update $service
    sudo docker service update -d --image $1 $service
done
