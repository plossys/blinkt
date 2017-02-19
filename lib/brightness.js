'use strict';

const min = 0.1;
const max = 1.0;

const brightness = function (container, callback) {
  container.stats({ stream: false }, (err, stats) => {
    if (err) {
      /* eslint-disable no-console */
      console.error('Error reading CPU stats, fallback to minimal brightness.', err.message);
      /* eslint-enable no-console */
      return callback(null, min);
    }

    let cpuTimeContainer;
    let cpuTimeTotal;
    let cpuCountContainer;
    let cpuCountTotal;

    try {
      // CPU time used by the container
      cpuTimeContainer = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;

      // CPU time used by the system in total
      cpuTimeTotal = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;

      // CPU cores used by the container
      cpuCountContainer = stats.cpu_stats.cpu_usage.percpu_usage.filter((value, index) => {
        return stats.precpu_stats.cpu_usage.percpu_usage[index] !== value;
      }).length;

      // Total number of cores in the system
      cpuCountTotal = stats.cpu_stats.cpu_usage.percpu_usage.length;
    } catch (e) {
      /* eslint-disable no-console */
      console.error('Error calculating CPU usage, fallback to minimal brightness.', e.message);
      /* eslint-enable no-console */
      return callback(null, min);
    }

    // Amplify ratio by taking the number of used CPU cores into account
    // If e.g 1 of 4 cores is completly used, the ratio will be 100% instead of 25%
    // If e.g 2 of 4 cores are completly used, the ratio will be 200% instead of 50%
    // So, we can use the full range of brightness to indicate the CPU usage of
    // our Node.js containers
    const ratio = (cpuTimeContainer / cpuTimeTotal) * cpuCountTotal / cpuCountContainer;

    const result = min + (ratio * (max - min));

    // Catch math errors
    if (isNaN(result)) {
      return callback(null, min);
    }

    // Limit brightness
    if (result > max) {
      return callback(null, max);
    }

    callback(null, result);
  });
};

module.exports = brightness;
