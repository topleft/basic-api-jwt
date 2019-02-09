#!/bin/bash

docker-compose up --build -d
sleep 15
docker-compose run web sh migrate.sh
docker-compose run web npm run test
docker-compose down
