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
    try {
      ctx.headers.schema_id = ctx.request.body.input.where.id;
      ctx.headers.namespace = '_all';
      ctx.headers.schema_type = 'k8s';
      await strapi.services.service.fetchServices(ctx);
    } catch {
    }
    return {
      registry: result,
    };
  },
};
