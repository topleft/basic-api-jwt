

# CICD on merge to master

# 1. run the tests in the docker container
# 2. if tests pass build container, else exit
# 3. update application version
# 4. commit version update
# 5. tag

# build and run test container
docker build -f Dockerfile.test -t topleft/api-boiler-test .
CONTAINER_ID=$(docker run -d --env-file=env_file.test topleft/api-boiler-test:latest)
echo "Container ID: $CONTAINER_ID"
EXIT_CODE=$(docker inspect $CONTAINER_ID --format='{{.State.ExitCode}}')

if [ $EXIT_CODE -eq 0 ]
  then
    echo "Tests past!\n"

    # bump minor version
    VERSION=$(npm version patch)
    git push origin master

    # build container, tag it and push it to Docker Hub
    docker build -f Dockerfile -t topleft/api-boiler:$VERSION .
    docker tag topleft/api-boiler:latest topleft/api-boiler:$VERSION
    echo $docker_password | docker login --username topleft --password-stdin
    docker push topleft/api-boiler:latestx
    docker push topleft/api-boiler:$VERSION

    echo "docker image: topleft/api-boiler:$VERSION"

    echo "push successful!\n"
  else
    echo "Tests failed with exit code: $EXIT_CODE"
fi
