'use strict';

/**
 * service controller
 */
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::service.service',({ strapi }) => ({
    async getServices(ctx) {
        return await strapi.service('api::service.service').getServices(ctx);
      },
    
      async getAllServices(ctx) {
        return await strapi.service('api::service.service').getAllServices(ctx);
      },
    
      async getService(args, ctx) {
        strapi.log.info('=========>>> service.getService()');
        const schemaType = ctx.koaContext.request.header.schema_type || '';
        if (schemaType === 'k8s') {
          try {
            await strapi.service('api::service.service').fetchServices(ctx, args, args.id);
          } catch (error) {
            strapi.log.error(error);
          }
        }
        return await strapi.db.query("api::service.service").findOne({where: {id: args.id}});
      },
    
      async fetchServices(ctx) {
        strapi.log.info('=========>>> service.fetchServices()');
        const schemaType = ctx.request.header.schema_type;
        if (schemaType === 'k8s') {
          return await strapi.services.service.fetchServices(ctx);
        } else {
          return true;
        }
      },
    
      async fetchAllServices(ctx) {
        strapi.log.info('=========>>> service.fetchAllServices()');
        const schemaType = ctx.request.header.schema_type;
        if (schemaType === 'k8s') {
          return await strapi.services.service.fetchAllServices(ctx);
        } else {
          return true;
        }
      },
    
      async updateServiceSync(args, ctx) {
        return await strapi.service('api::service.service').updateServiceSync(args, ctx);
      },
    
      async createServiceSync(ctx) {
        return await strapi.service('api::service.service').createServiceSync(ctx);
      },
    
      async deleteServiceSync(ctx) {
        return await strapi.service('api::service.service').deleteServiceSync(ctx);
      },
}));
