#!/bin/bash

set -e
image_tag=${1:-$IMAGE_TAG}

echo "received $image_tag"

services=$(docker service ls --format "{{.Name}}" | grep nwi-)

for service in ${services[@]}
do
    docker service update -d --image $image_tag $service
    echo "update $service"
done