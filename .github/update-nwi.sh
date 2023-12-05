#!/bin/bash

set -e
# update.nwi.sh {image tag}

image_tag=${1:-$IMAGE_TAG}

echo "received $image_tag"

services=$(docker service ls --format "{{.Name}}" | grep nwi-)

for service in ${services[@]}
do
    # rm static
    rm -fr /var/instances/$service/public/front/* /var/instances/$service/public/admin/*
    echo "remove static $service"

    # update service
    docker service update -d --image $image_tag $service
    echo "update service $service"
done