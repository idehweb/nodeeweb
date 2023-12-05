#!/bin/bash

set -e

# ./update-im.sh {name} {tag}

image_name=${1:-$IMAGE_TAG}
image_tag=${2:-$IMAGE_TAG}
im_token=${IM_TOKEN}

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
env_arr=$(cat $env_path)
echo "" > $env_path
for kv in ${env_arr[@]}
do
    replaced_kv=$(echo $kv | sed -r "s/INSTANCE_DEFAULT_IMAGE=.+/INSTANCE_DEFAULT_IMAGE=\"$image_tag\"/g")
    echo "$replaced_kv" >> $env_path
done;
echo "update env file"


# Update compose
cd /deploy/instance-manager && ./compose.sh -d
echo "update compose file"