# rainbow

Show a cycling rainbow with Blinkt! LED strip.

```bash
npm install
sudo node app.js
```

## Starting the Docker container

To start the container, type:

```
docker run --privileged -v /sys/class/gpio/:/sys/class/gpio/ plossys/blinkt
```

To run the container without the `--privileged` option, allow everyone to write to the GPIO sysfs folders:

```
sudo chmod -R a+w /sys/class/gpio/
sudo chmod -R a+w /sys/devices/platform/soc/3f200000.gpio/gpio
```

Now, you can run the container in swarm mode, too!
