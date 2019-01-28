cd ~/basic-api-jwt
git checkout origin master
git pull origin master
sudo docker build -f Dockerfile.test -t topleft/api-boiler-test .
CONTAINER_ID=$(sudo docker run -d --env-file=env_file.test topleft/api-boiler-test:latest)
echo "Container ID: $CONTAINER_ID"
EXIT_CODE=$(docker inspect $CONTAINER_ID --format='{{.State.ExitCode}}')
if [ $EXIT_CODE -eq 0 ]
  then
    echo "Tests past!\n"
    sudo docker build -f Dockerfile.dev -t topleft/api-boiler:latest .
    echo build successful!\\n
    VERSION=$(npm version patch)
    sudo git push origin master
    cat ~/docker.password | sudo docker login --username foo --password-stdin
    sudo docker push topleft/api-boiler:$VERSION
    echo "image: topleft/api-boiler:$VERSION"
    echo push successful!\\n
    sudo docker run -d -it -p 3030:3030 --env-file=~/veggies_env_file.dev topleft/api-boiler:$VERSION
  else
    echo "Tests failed with exit code: $EXIT_CODE"
    exit(1)
fi
