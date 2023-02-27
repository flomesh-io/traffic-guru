"use strict";

module.exports = {
  beforeCreate: async (event) => {
    const data = event.params.data
    data.traceId = data.trace.id;
    data.resStatus = data.res.status;
    data.serviceName = data.service.name;
    data.podName = data.pod.name;
    data.podIp = data.pod.ip;
  },
};  