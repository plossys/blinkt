# PLOSSYS Blinkt!

[![Build Status](https://travis-ci.org/plossys/blinkt.svg?branch=master)](https://travis-ci.org/plossys/blinkt)
[![This image on DockerHub](https://img.shields.io/docker/pulls/plossys/blinkt.svg)](https://hub.docker.com/r/plossys/blinkt/)

Visualizes the running Docker containers with Blinkt! LED strip.

- [Dockerfile.amd64](https://github.com/plossys/blinkt/blob/master/Dockerfile.amd64)
- [Dockerfile.arm](https://github.com/plossys/blinkt/blob/master/Dockerfile.arm)

## Start the Docker container

To start the container, type:

```
docker run -v /sys:/sys -v /var/run/docker.sock:/var/run/docker.sock plossys/blinkt
```

## Swarm mode

To start it in a Docker swarm, type:

### Start service

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
