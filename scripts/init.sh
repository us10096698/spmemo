#!/bin/sh

if [ $# -lt 1 ]; then
  echo "Usage:"
  echo "./init.sh APPNAME"
  exit 1
fi

set -x
cd `dirname $0`/..
APPNAME=$1

for file in "package.json\
  bower.json\
  public/index.html\
  public/app.js\
  public/controllers/helloCtrl.js\
  test/client/helloCtrlSpec.js"
do 
  sed -i "" "s/myapp/$APPNAME/g" $file
done

set +x
