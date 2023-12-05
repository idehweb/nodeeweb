#!/bin/bash

set -e

# ./update-im.sh {name} {tag} {im token}

image_name=${1:-$IMAGE_TAG}
image_tag=${2:-$IMAGE_TAG}
im_token=${3:-$IM_TOKEN}

echo "received $image_tag"

# Update API
curl -fk --location 'http://127.0.0.1:2760/api/v1/image' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${im_token}" \
--data "{
    \"name\" : \"${image_name}\",
    \"image\" : \"${image_tag}\"
}" || exit 1
echo "update api"

# Update Env
env_path="/deploy/instance-manager/.env.local"
node /update-env.js $env_path INSTANCE_DEFAULT_IMAGE $image_tag 
echo "update env file"


# Update compose
cd /deploy/instance-manager && ./compose.sh -d
echo "update compose file"