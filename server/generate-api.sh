#!/bin/sh

set -e
ROOT=$(realpath $(dirname $0))
cd "$ROOT"

docker run --rm -v "${PWD}":/app raghtnes/openapi-generator-fastapi-security-fix:tagname generate  \
    -i /app/src/spec.yml  -g python-fastapi   -o /app/openapi-generator-output \
    --additional-properties=packageName=suai_project.endpoints --additional-properties=fastapiImplementationPackage=suai_project.endpoints

rm -Rf src/suai_project/endpoints/apis src/suai_project/endpoints/models
mv openapi-generator-output/src/suai_project/endpoints/apis src/suai_project/endpoints/apis
mv openapi-generator-output/src/suai_project/endpoints/models src/suai_project/endpoints/models
#mv openapi-generator-output/src/suai_project/endpoints/security_api.py src/suai_project/endpoints/security_api.py
mv openapi-generator-output/src/suai_project/endpoints/main.py src/suai_project/endpoints/router_init.py
rm -Rf openapi-generator-output
