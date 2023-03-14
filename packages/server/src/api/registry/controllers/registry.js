'use strict';

/**
 * registry controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::registry.registry', ({ strapi }) => ({
  async ping(args) {
    const data = args.data;
    let pingResult;
    if (data.type == 'k8s') {
      pingResult = await strapi.service('api::registry.registry').pingK8s(data);
    } else if (data.type == 'eureka') {
      pingResult = await strapi.service('api::registry.registry').pingEureka(data);
    } else {
      pingResult = {
        isOK: false,
        status: -1,
        error: `Invalid registry type: ${data.type}`,
      };
    }
    return pingResult;
  },

  async refresh(ctx, args) {
    await strapi.db.query("api::registry.registry").update({where:{...args}, data: {updated_at: new Date()}})
    // already done it at afterUpdate()
    // try {
    //   ctx.koaContext.request.header.schema_id = args.id;
    //   ctx.koaContext.request.header.namespace = '_all';
    //   ctx.koaContext.request.header.schema_type = 'k8s';
    //   await strapi.service('api::service.service').fetchServices(ctx, args);
    // } catch (error) {
    //   console.error(error)
    // }
    return true;
  },
}));
