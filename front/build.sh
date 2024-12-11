#!/bin/bash
set -e

#
#         Prepare variables
#
echo Build.SH: $1
ROOT=$(dirname $0)
if [ -z "$1" ]; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
else
    BRANCH=$1
fi
BUILD_DATE=$(date +"%Y-%m-%dT%T")
BUILD_COMMIT_ID=$(git rev-parse HEAD)


#
#       Build docker image
#
echo Builing docker image ...
LABEL=`echo "$BRANCH" | tr '[:upper:]' '[:lower:]'`
echo $LABEL
IMAGE=raghtnes/suai-front:$LABEL
echo $IMAGE
docker build . -f Dockerfile \
    --build-arg REACT_APP_EVENTOS_PROXY=http://95.213.151.198:5000 \
    -t $IMAGE


#
#       Tag and push docker image
docker push $IMAGE

echo "$IMAGE"

