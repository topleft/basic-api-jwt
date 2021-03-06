echo 'Running tests ... '
docker build -f Dockerfile.test --pull --cache-from topleft/api-boiler-test:latest -t topleft/api-boiler-test:latest .
CONTAINER_ID=$(docker run --network='host' -e BASIC_DB_TEST=postgres://postgres@gateway.docker.internal:5432/basic_db_test -e TOKEN_SECRET -e NODE_ENV topleft/api-boiler-test:latest)
echo "Container ID: $CONTAINER_ID"

if ! [ $CONTAINER_ID ]; then exit 1;

STATUS=$(docker inspect $CONTAINER_ID --format='{{.State.Status}}')
until [ $STATUS = 'exited' ]; do
  sleep 2
  STATUS=$(docker inspect $CONTAINER_ID --format='{{.State.Status}}');
done

EXIT_CODE=$(docker inspect $CONTAINER_ID --format='{{.State.ExitCode}}')
if [ $EXIT_CODE -eq 0 ];
  then
    echo "\nTests past!\n"
  else
    echo "\nTests failed\n"
fi
exit EXIT_CODE
