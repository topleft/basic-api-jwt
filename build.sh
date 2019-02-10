#!/bin/bash

echo "\nTests past!\n"

# update and commit application version
VERSION=$(npm version patch)

# push new version and tag to git
git push
git push --tags

# build container
docker build -f Dockerfile -t topleft/api-boiler:$VERSION .

# tag it
docker tag topleft/api-boiler:latest topleft/api-boiler:$VERSION

# sign in to docker hub
echo $DOCKER_PASSWORD | docker login --username topleft --password-stdin

# push both latest and $version to docker hub
docker push topleft/api-boiler:latest
docker push topleft/api-boiler:$VERSION

echo "DOCKER IMAGE: topleft/api-boiler:$VERSION\n"
echo "Build successful!\n"
