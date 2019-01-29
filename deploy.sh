
git checkout origin master
git pull origin master
docker build -f Dockerfile.test -t topleft/api-boiler-test .
CONTAINER_ID=$(docker run -d --env-file=env_file.test topleft/api-boiler-test:latest)
echo "Container ID: $CONTAINER_ID"
EXIT_CODE=$(docker inspect $CONTAINER_ID --format='{{.State.ExitCode}}')
if [ $EXIT_CODE -eq 0 ]
  then
    echo "Tests past!\n"
    docker build -f Dockerfile -t topleft/api-boiler:latest .
    echo build succgssessful!\\n
    VERSION=$(npm version patch)
    git push origin master
    echo $docker_password | docker login --username topleft --password-stdin
    docker push topleft/api-boiler:$VERSION
    echo "image: topleft/api-boiler:$VERSION"
    echo push successful!\\n
    docker run -d -it -p 3030:3030 --env-file=env_file.dev topleft/api-boiler:$VERSION
  else
    echo "Tests failed with exit code: $EXIT_CODE"
fi
