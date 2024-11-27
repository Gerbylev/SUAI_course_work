#!/bin/bash

set -e
ROOT=$(realpath $(dirname $0))
cd "$ROOT"

if [ -z "$1" ]; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
else
    BRANCH=$1
fi

#     GENERATE API
sh ./generate-api.sh

##     BUILD PRODUCTION IMAGE
SERVICE_NAME="suai_project"
BRANCH_NAME_LOWER=$(echo "$BRANCH" | tr '[:upper:]' '[:lower:]')
BUILD_DATE=$(date +"%Y-%m-%dT%T")
BUILD_COMMIT_ID=$(git rev-parse HEAD)


IMAGE=raghtnes/$SERVICE_NAME:$BRANCH_NAME_LOWER

DOCKER_BUILDKIT=1 docker build . -t $IMAGE
docker push $IMAGE

echo "$IMAGE"
