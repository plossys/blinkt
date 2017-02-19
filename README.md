# PLOSSYS Blinkt!

[![Build Status](https://travis-ci.org/plossys/blinkt.svg?branch=master)](https://travis-ci.org/plossys/blinkt)
[![This image on DockerHub](https://img.shields.io/docker/pulls/plossys/blinkt.svg)](https://hub.docker.com/r/plossys/blinkt/)

Visualizes the running Docker containers with Blinkt! LED strip. Each container is associated with a color and the CPU usage of the container is indicated by the brightness.

- [Dockerfile.amd64](https://github.com/plossys/blinkt/blob/master/Dockerfile.amd64)
- [Dockerfile.arm](https://github.com/plossys/blinkt/blob/master/Dockerfile.arm)

## Start locally

To run the app, type:

```
node bin/app.js
```

If the platform is not supported by Blinkt!, the calculated colors are printed to the console. So, you can easily debug it.

## Start the Docker container

To start the container, type:

```
docker run -it -v /sys:/sys -v /var/run/docker.sock:/var/run/docker.sock plossys/blinkt
```

## Swarm mode

### Start service

To start it in a Docker swarm, type:

```bash
docker service create --name blinkt --mount type=bind,src=/sys,dst=/sys --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock plossys/blinkt:0.0.3
```

### Scale service

```bash
docker service scale blinkt=3
```

### Rolling updates

Rolling updates are [configured at start time](https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/) by setting `--update-delay`:

```bash
docker service create --name blinkt --update-delay 10s --mount type=bind,src=/sys,dst=/sys --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock plossys/blinkt:0.0.3
```

```bash
docker service update --image plossys/blinkt:0.0.5 blinkt
```

### Global service

To run it on *all nodes* in a swarm cluster, type:

```bash
docker service create --name blinkt --mount type=bind,src=/sys,dst=/sys --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock --mode global plossys/blinkt:0.0.3
```

## Environment variables

### INTERVAL

By default, the container list is updated every second. You can change the update interval via the environment variable `INTERVAL`. To set it to 0.5s (500 milliseconds), type:

```
docker run -it -e "INTERVAL=500" -v /sys:/sys -v /var/run/docker.sock:/var/run/docker.sock plossys/blinkt
```

### COLORS

To define custom colors for containers, set the `COLORS` environment variable. It must be a JSON object with image names as properties. Each property must contain an array with 3 values ranging from 0 to 255, that represent the values for red, green, blue.

To set the color for containers with the image `plossys/foo:v1` to red, type:

```
docker run -it -e 'COLORS={"plossys/foo:v1": [255, 0, 0]}' -v /sys:/sys -v /var/run/docker.sock:/var/run/docker.sock plossys/blinkt
```

The COLORS variable will be filtered using the image name and tag of a container. So, a container running `plossys/foo:v2` will *not* be colored in red because the tag does not match. This allows you to assign different colors to different versions of the same image.

This command shows containers running `v1` of `plossys/foo` in red and `v2` in green:

```
docker run -it -e 'COLORS={"plossys/foo:v1": [255, 0, 0],"plossys/foo:v2": [0, 255, 0]}' -v /sys:/sys -v /var/run/docker.sock:/var/run/docker.sock plossys/blinkt
```

To assign a color to *all* versions of an image, just omit the tag.

This command shows all containers of `plossys/foo` in green, regardless of the tag:

```
docker run -it -e 'COLORS={"plossys/foo": [255, 0, 0]' -v /sys:/sys -v /var/run/docker.sock:/var/run/docker.sock plossys/blinkt
```

If you define colors for an image with and without tags, an exact match takes precedence.

This command shows containers running `v1` of `plossys/foo` in red and any other running the image in green:

```
docker run -it -e 'COLORS={"plossys/foo:v1": [255, 0, 0],"plossys/foo": [0, 255, 0]}' -v /sys:/sys -v /var/run/docker.sock:/var/run/docker.sock plossys/blinkt
```
