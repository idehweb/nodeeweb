#!/usr/bin/env bash
SOURCE=$1
DEST=$2

rm -rf $DEST && cp -r $SOURCE $DEST


exit 0
