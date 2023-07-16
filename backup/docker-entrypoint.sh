#!/bin/bash

set -e

mkdir -p /var/backups/nodeeweb 


# Active v2ray in background
if [ -e "/etc/v2ray-config.json" ]
then
  /var/v2ray/v2ray -config=/etc/v2ray-config.json &
fi;

# Run CMD
exec $@