'use strict';

/**
 * service controller
 */
const { createCoreController } = require('@strapi/strapi').factories;
const k8s = require('@kubernetes/client-node');

module.exports = createCoreController('api::service.service',({ strapi }) => ({
    async getServices(ctx) {
        return await strapi.service('api::service.service').getServices(ctx);
      },
    
      async getAllServices(ctx) {
        return await strapi.service('api::service.service').getAllServices(ctx);
      },
    
      async getService(args, ctx) {
        strapi.log.info('=========>>> service.getService()');
        const schemaId = ctx.koaContext.request.header.schema_id || '';
        const schemaType = ctx.koaContext.request.header.schema_type || '';
        if (schemaType === 'k8s') {
          try {
            await strapi.service('api::service.service').fetchServices(ctx, args, args.id);
          } catch (error) {
            console.error(error);
          }
        }
        const service = await strapi.db.query("api::service.service").findOne({where: {id: args.id}});

        if (schemaType === 'k8s') {
          const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
            schemaId,
            schemaType
          );
          const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

          const pods = await k8sApi.listNamespacedPod(
            service.content?.metadata?.namespace,
            null,
            null,
            null,
            null,
            service.content?.spec?.selector?.app ? "app=" + service.content?.spec?.selector?.app : null
          );
          service.pods = pods.body.items
        }
        return service;
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
    
      async createServiceSync(args, ctx) {
        return await strapi.service('api::service.service').createServiceSync(args, ctx);
      },
    
      async deleteServiceSync(args, ctx) {
        return await strapi.service('api::service.service').deleteServiceSync(args, ctx);
      },
}));
