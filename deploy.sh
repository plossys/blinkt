#!/bin/bash
set -e

docker tag blinkt plossys/blinkt:linux-$ARCH-$TRAVIS_TAG
docker push plossys/blinkt:linux-$ARCH-$TRAVIS_TAG

if [ $ARCH == "amd64" ]; then
  set +e
  echo "Waiting for other images plossys/blinkt:linux-arm-$TRAVIS_TAG"
  until docker run --rm stefanscherer/winspector plossys/blinkt:linux-arm-$TRAVIS_TAG
  do
    sleep 15
    echo "Try again"
  done
  set -e

  echo "Downloading manifest-tool"
  wget https://github.com/estesp/manifest-tool/releases/download/v0.4.0/manifest-tool-linux-amd64
  mv manifest-tool-linux-amd64 manifest-tool
  chmod +x manifest-tool
  ./manifest-tool

  echo "Pushing manifest plossys/blinkt:$TRAVIS_TAG"
  ./manifest-tool push from-args \
    --platforms linux/amd64,linux/arm \
    --template plossys/blinkt:OS-ARCH-$TRAVIS_TAG \
    --target plossys/blinkt:$TRAVIS_TAG

  echo "Pushing manifest plossys/blinkt:latest"
  ./manifest-tool push from-args \
    --platforms linux/amd64,windows/amd64 \
    --template plossys/blinkt:OS-ARCH-$TRAVIS_TAG \
    --target plossys/blinkt:latest
fi
