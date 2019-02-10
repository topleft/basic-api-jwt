#!/bin/bash

docker-compose run web sh migrate.sh
until [ $? -eq 0 ]; do
  docker-compose run web sh migrate.sh
done
docker-compose run web npm run test
