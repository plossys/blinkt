#!/bin/bash
set -e

if [ $ARCH != "amd64" ]; then
  # prepare qemu
  docker run --rm --privileged multiarch/qemu-user-static:register --reset
fi

if [ -d tmp ]; then
  docker rm build
  rm -rf tmp
fi

# build image
docker build -t build -f Dockerfile.$ARCH-build .
docker create --name build build
docker cp build:/code/ tmp/
docker build -t blinkt -f Dockerfile.$ARCH .
