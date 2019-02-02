

# CICD on merge to master

# Be sure the directory is clean
if ! (git status | grep 'nothing to commit'); then
  echo "\nWARNING\n"
  echo "You have uncommited changes. Please commit changes before building.\n"
  echo "Exiting build script.\n"
  exit 1
fi

# 1. Clear the database and apply migrations
# 2. run the tests in the docker container
# 3. if tests pass, continue
# 4. update and commit application version
# 5. push new version and tag to git
# 6. build container
# 7. tag it
# 8. sign in to docker hub
# 9. push both latest and $version to docker hub

# 1. Clear the database and apply migrations
knex migrate:rollback --env test --knexfile ./knexfile.js
knex migrate:latest --env test --knexfile ./knexfile.js
# 2. run the tests in the docker container
echo 'Running tests ... '
docker build -f Dockerfile.test -t topleft/api-boiler-test .
CONTAINER_ID=$(docker run -d --env-file=env_file.test topleft/api-boiler-test:latest)
echo "Container ID: $CONTAINER_ID"

STATUS=$(docker inspect $CONTAINER_ID --format='{{.State.Status}}')
until [ $STATUS = 'exited' ]; do
  sleep 2
  STATUS=$(docker inspect $CONTAINER_ID --format='{{.State.Status}}');
done

EXIT_CODE=$(docker inspect $CONTAINER_ID --format='{{.State.ExitCode}}')
# 3. if tests pass, continue
if [ $EXIT_CODE -eq 0 ];
  then
    echo "\nTests past!\n"

    # 4. update and commit application version
    VERSION=$(npm version patch)
    # 5. push new version and tag to git
    git push
    git push --tags

    # 6. build container
    docker build -f Dockerfile -t topleft/api-boiler:$VERSION .

    # 7. tag it
    docker tag topleft/api-boiler:latest topleft/api-boiler:$VERSION

    # 8. sign in to docker hub
    echo $docker_password | docker login --username topleft --password-stdin

    # 9. push both latest and $version to docker hub
    docker push topleft/api-boiler:latest
    docker push topleft/api-boiler:$VERSION

    echo "DOCKER IMAGE: topleft/api-boiler:$VERSION\n"
    echo "Build successful!\n"
  else
    echo "\n Tests failed.\n"
    echo "For details run --> \n docker logs $CONTAINER_ID\n"
    exit 1
fi
