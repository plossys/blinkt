# PLOSSYS Blinkt!
[![Build Status](https://travis-ci.org/plossys/blinkt.svg?branch=master)](https://travis-ci.org/plossys/blinkt)
[![](https://images.microbadger.com/badges/image/plossys/blinkt.svg)](https://microbadger.com/images/plossys/blinkt "Get your own image badge on microbadger.com")

Show a cycling rainbow with Blinkt! LED strip.

```bash
npm install
sudo node app.js
```

## Starting the Docker container

To start the container, type:

```
docker run -v /sys:/sys plossys/blinkt
```

## Swarm mode

To start it in a Docker swarm, type:

### Start service

```bash
docker service create --name blinkt --mount type=bind,src=/sys,dst=/sys plossys/blinkt:0.0.3
```

### Scale service

```bash
docker service scale blinkt=3
```

### Rolling updates

```bash
docker service update --image plossys/blinkt:0.0.5 blinkt
```
