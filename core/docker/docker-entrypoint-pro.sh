#!/bin/bash
set -e

build(){
#  npm run prebuild
 npm run build
 npm cache clean --force
#  date > buildtime

}

file_env(){
  local var_name="${1}"
  local file_var="${var_name}_FILE"
  if [ -f ${!file_var} ]
  then
    local var_value=`cat ${!file_var}`
    export "${var_name}_SECRET"=$var_value
    unset $file_var
  else
    echo "$file_var not exists maybe set before , value : ${!file_var}"
  fi
}

_main(){
  echo "####### PRODUCTION ENTRYPOINT START #######"
  echo "####### PRODUCTION ENTRYPOINT END #######"
}

_main
exec $@