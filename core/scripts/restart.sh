#!/usr/bin/env bash
SITE=$1

pm2 restart $SITE

#pm2 logs $SITE

exit 0
