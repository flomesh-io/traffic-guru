'use strict';

module.exports = {
  async ping(ctx) {
    const data = ctx.request.body.input;
    let pingResult;
    if (data.type == 'k8s') {
      pingResult = await strapi.services.registry.pingK8s(data);
    } else {
      pingResult = {
        isOK: false,
        status: -1,
        error: `Invalid registry type: ${data.type}`,
      };
    }
    return pingResult;
  },

  async refresh(ctx) {
    const result = await strapi.controllers.registry.update(ctx);
    return {
      registry: result,
    };
  },
};
