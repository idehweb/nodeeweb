#!/bin/bash
set -e
echo "received: $GITHUB_RUN_ID $ARTIFACT_NAME $TARGET_PATH"

# remove old tmp dir
if [ -e /var/my-tmp/$ARTIFACT_NAME ]
then
  echo $USER_PASS | sudo -S rm -r /var/my-tmp/$ARTIFACT_NAME;
  echo "Remove Dir" /var/my-tmp/$ARTIFACT_NAME
fi

# create new tmp dir
echo $USER_PASS | sudo -S mkdir -p /var/my-tmp/$ARTIFACT_NAME
echo "Create Dir" /var/my-tmp/$ARTIFACT_NAME

# download from github
cd /var/my-tmp/download
echo $USER_PASS | sudo -S GITHUB_RUN_ID=$GITHUB_RUN_ID TARGET_PATH=$TARGET_PATH ACTIONS_RUNTIME_TOKEN=$ACTIONS_RUNTIME_TOKEN ACTIONS_RUNTIME_URL=$ACTIONS_RUNTIME_URL OUTPUT_PATH=/var/my-tmp/$ARTIFACT_NAME ARTIFACT_NAME=$ARTIFACT_NAME node index
# sudo -S gh run download $RUN_ID -n $ARTIFACT_NAME -R $REPO_NAME -D /var/tmp/$ARTIFACT_NAME
echo "Download Compelete"

# backup
if [ -e /var/my-tmp/backup ]
then
  echo $USER_PASS | sudo -S rm -r /var/my-tmp/backup;
  echo "Remove Old Backup"
fi
echo $USER_PASS | sudo -S mkdir -p /var/my-tmp/backup
echo $USER_PASS | sudo -S mkdir -p $TARGET_PATH
echo $USER_PASS | sudo -S mv $TARGET_PATH /var/my-tmp/backup
echo "Backup" $TARGET_PATH

# replace
echo $USER_PASS | sudo -S mv /var/my-tmp/$ARTIFACT_NAME/ $TARGET_PATH
echo "Replace" $TARGET_PATH

# chmod
echo $USER_PASS | sudo -S chmod -R 755 $TARGET_PATH
echo "Chmod" $TARGET_PATH