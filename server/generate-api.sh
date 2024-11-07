#!/bin/sh

set -e
ROOT=$(realpath $(dirname $0))
cd "$ROOT"

docker build . -f Dockerfile-swagger \
              --build-arg USER=$USER \
              --build-arg UID=$(id -u) \
              --build-arg GID=$(id -g) \
              -t my-openapi-generator

docker run --rm -v "${PWD}":/app my-openapi-generator generate  \
    -i /app/src/spec.yml  -g python-fastapi   -o /app/openapi-generator-output \
    --additional-properties=packageName=suai_project.endpoints --additional-properties=fastapiImplementationPackage=suai_project.endpoints

rm -Rf src/suai_project/endpoints/apis src/suai_project/endpoints/models
mv openapi-generator-output/src/suai_project/endpoints/apis src/suai_project/endpoints/apis
mv openapi-generator-output/src/suai_project/endpoints/models src/suai_project/endpoints/models
mv openapi-generator-output/src/suai_project/endpoints/main.py src/suai_project/endpoints/router_init.py
rm -Rf openapi-generator-output
