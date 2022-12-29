'use strict';

const url = require('url');
const k8s = require('@kubernetes/client-node');

module.exports = {
  async getServices(ctx) {
    if (!ctx.header.schema_id || ctx.header.schema_id == 'null')
      return { values: [], aggregate: { totalCount: 0 } };
    const query = url.parse(ctx.request.url, true).query;
    query.registry = ctx.header.schema_id;
    if (ctx.header.namespace !== '_all') {
      query.namespace = ctx.header.namespace;
    }

    const result = await strapi.query('service').find(query);
    const total = await strapi.query('service').count(query);
    return { values: result, aggregate: { totalCount: total } };
  },

  async getAllServices(ctx) {
    return await strapi.services.service.getAllServices(ctx);
  },

  async getService(ctx) {
    strapi.log.info('=========>>> service.getService()');
    const schemaType = ctx.request.header.schema_type;
    if (schemaType === 'k8s') {
      try {
        await strapi.services.service.fetchServices(ctx, ctx.query.id);
      } catch (error) {
        strapi.log.error(error);
      }
    }
    const service = await strapi.services.service.findOne(ctx.query);

    if (service.content?.spec?.selector?.app) {
      const kc = await strapi.services.kubernetes.getKubeConfig(
        service.registry.id,
        "k8s"
      );
      const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
      const items = await k8sCoreApi.listNamespacedPod(
        service.content.metadata.namespace, null, null, null, null, "app=" + service.content.spec.selector.app
      );
      service.pods = items.body.items
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

  async updateServiceSync(ctx) {
    return await strapi.services.service.updateServiceSync(ctx);
  },

  async createServiceSync(ctx) {
    return await strapi.services.service.createServiceSync(ctx);
  },

  async deleteServiceSync(ctx) {
    return await strapi.services.service.deleteServiceSync(ctx);
  },
};
