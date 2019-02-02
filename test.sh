echo 'Running tests ... '
docker build -f Dockerfile.test --pull --cache-from topleft/api-boiler-test: -t topleft/api-boiler-test .
CONTAINER_ID=$(docker run -d -e BASIC_DB_TEST -e TOKEN_SECRET -e NODE_ENV topleft/api-boiler-test:latest)
echo "Container ID: $CONTAINER_ID"

STATUS=$(docker inspect $CONTAINER_ID --format='{{.State.Status}}')
until [ $STATUS = 'exited' ]; do
  sleep 2
  STATUS=$(docker inspect $CONTAINER_ID --format='{{.State.Status}}');
done

EXIT_CODE=$(docker inspect $CONTAINER_ID --format='{{.State.ExitCode}}')
if [ $EXIT_CODE -eq 0 ];
  then
    echo "\nTests past!\n"
    exit 0
  else
    echo "\nTests failed\n"
    exit 1
fi
