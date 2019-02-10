#!/bin/bash
echo "Trying migration"

RETRIES=5
until docker-compose run web sh migrate.sh > /dev/null 2>&1; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 5
  if [ $RETRIES -eq 0 ]
  then
    exit 1
  fi
done
echo "migration successful!"

docker-compose run web npm run test
