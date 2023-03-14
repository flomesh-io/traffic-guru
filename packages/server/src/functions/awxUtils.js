'use strict';

const axios = require('axios');

module.exports = {
  async doAction(testTarget, action) {
    let result = false;
    const deployPath = '/11/launch/';
    const stopPath = '/13/launch/';
    const awxAxios = axios.create({
      baseURL: process.env.BENCHMARK_TEST_BASEURL,
      auth: {
        username: process.env.BENCHMARK_TEST_USERNAME,
        password: process.env.BENCHMARK_TEST_PASSWORD,
      },
      headers: { 'Content-Type': 'application/json' },
    });
    try {
      if (action == 1) {
        //do deploy
        const postBody = {
          limit: testTarget.host + ',' + process.env.BENCHMARK_TEST_SERVER,
          extra_vars: {
            os: testTarget.os,
            arch: testTarget.arch,
            pipy_version: testTarget.pipy_version,
          },
        };
        const response = await awxAxios.post(deployPath, postBody);
        if (response.status < 300) {
          result = true;
        }
      } else {
        // do stop
        const postBody = {
          limit: testTarget.host,
        };
        const response = await awxAxios.post(stopPath, postBody);
        if (response.status < 300) {
          result = true;
        }
      }
    } catch (error) {
      console.error(error.toJSON());
    }

    return result;
  },

  async pingTestTarget(targetServer) {
    try {
      const result = await axios.get(
        'http://' + targetServer + ':6060/metrics'
      );
      if (result.status == 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },
};
