

# CICD on merge to master

# Be sure the directory is clean
if ! (git status | grep 'nothing to commit'); then
  echo "\nWARNING\n"
  echo "You have uncommited changes. Please commit changes before building.\n"
  echo "Exiting build script.\n"
  exit 1
fi

# 1. run the tests in the docker container
# 2. if tests continue
# 3. update application version
# 4. push new version and tag to git
# 5. build container
# 6. tag it
# 7. sign in to docker hub
# 8. push both latest and $version to docker hub

# 1. run the tests in the docker container
docker build -f Dockerfile.test -t topleft/api-boiler-test .
CONTAINER_ID=$(docker run -d --env-file=env_file.test topleft/api-boiler-test:latest)
echo "Container ID: $CONTAINER_ID"
EXIT_CODE=$(docker inspect $CONTAINER_ID --format='{{.State.ExitCode}}')

# 2. if tests continue
if [ $EXIT_CODE -eq 0 ]
  then
    echo "\nTests past!\n"

    # 3. update and commit application version
    VERSION=$(npm version patch)
    # 4. push new version and tag to git
    git push
    git push --tags

    # 5. build container
    docker build -f Dockerfile -t topleft/api-boiler:$VERSION .

    # 6. tag it
    docker tag topleft/api-boiler:latest topleft/api-boiler:$VERSION

    # 7. sign in to docker hub
    echo $docker_password | docker login --username topleft --password-stdin

    # 8. push both latest and $version to docker hub
    docker push topleft/api-boiler:latest
    docker push topleft/api-boiler:$VERSION

    echo "DOCKER IMAGE: topleft/api-boiler:$VERSION\n"
    echo "Build successful!\n"
  else
    echo "Tests failed with exit code: $EXIT_CODE"
fi
