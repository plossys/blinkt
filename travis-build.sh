#!/bin/bash
set -e

if [ $ARCH != "amd64" ]; then
  # prepare qemu
  if [ ! -z "$TRAVIS" ]; then
    docker run --rm --privileged multiarch/qemu-user-static:register --reset
  fi

  if [ $ARCH == "arm64" ]; then
    # prepare qemu binary
    docker create --name register hypriot/qemu-register
    docker cp register:qemu-aarch64 qemu-aarch64-static
  fi
fi

if [ -d tmp ]; then
  set +e
  docker rm build
  set -e
  rm -rf tmp
fi

# build image
docker build -t build -f Dockerfile.$ARCH-build .
docker create --name build build
docker cp build:/code/ tmp/
docker build -t blinkt -f Dockerfile.$ARCH .
