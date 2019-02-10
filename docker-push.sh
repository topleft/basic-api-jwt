echo "Build image version $VERSION"

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
