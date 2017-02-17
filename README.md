# PLOSSYS Blinkt!

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

## Start as a Docker swarm service

To start it in a Docker swarm, type:

```bash
docker service create --name blinkt --mount type=bind,src=/sys,dst=/sys plossys/blinkt
```

```bash
docker service scale blinkt=3
```
