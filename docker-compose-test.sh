#!/bin/bash

docker-compose run web sh migrate.sh
docker-compose run web npm run test
