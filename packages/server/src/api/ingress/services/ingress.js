'use strict';

/**
 * ingress service
 */

const { createCoreService } = require('@strapi/strapi').factories;

const k8s = require('@kubernetes/client-node');
const kubeUtils = require("../../../functions/kubeUtils.js");
const type = 'ingress';

module.exports = createCoreService('api::ingress.ingress',{
    async getIngresses(args, ctx) {
      return await kubeUtils.getKubeEntitys(ctx, type, args);
    },
    async getIngress(args) {
      const result = await super.findOne(args.id);
      return result;
    },
      async fetchIngresses(args, ctx, id) {
        const k8s_cluster_id = ctx.koaContext.request.header.schema_id || '';
        const k8s_cluster_ns = ctx.koaContext.request.header.namespace || '';
        const k8s_cluster_type = ctx.koaContext.request.header.schema_type || '';
        const kc = await await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          k8s_cluster_id,
          k8s_cluster_type
        );
        const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);
    
        let res;
        if (id) {
          const values = await strapi.db.query('api::ingress.ingress').findOne({where: { id: id }});
          if (values) {
            res = await k8sApi.readNamespacedIngress(
              values.content.metadata.name,
              values.namespace.name
            );
          }
          if (!res) {
            await strapi.db.query('api::ingress.ingress').update({where: { id: id }, data: { delete: 1 }});
            return;
          }
          res.body = { items: [res.body] };
        } else if (k8s_cluster_ns && k8s_cluster_ns !== '_all') {
          res = await k8sApi.listNamespacedIngress(k8s_cluster_ns);
        } else {
          res = await k8sApi.listIngressForAllNamespaces();
        }
        return await kubeUtils.initKubeEntitys(
          ctx,
          type,
          res,
          id
        );
      },
      async updateIngressSync(ctx) {
        const id = ctx.params.id;
        const data = await strapi.query(type).findOne({ id: id });
    
        const kc = await await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          data.namespace.registry,
          'k8s'
        );
        const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);
    
        try {
          delete ctx.request.body.content.metadata.creationTimestamp;
          delete ctx.request.body.content.metadata.managedFields;
        } catch (error) {}
    
        try {
          await k8sApi.replaceNamespacedIngress(
            ctx.request.body.content.metadata.name,
            ctx.request.body.content.metadata.namespace,
            ctx.request.body.content
          );
        } catch (error) {
          strapi.log.info(error.response.body.message);
          throw new Error(error.response.body.message);
        }
        await k8sApi.readNamespacedIngress(
          ctx.request.body.content.metadata.name,
          ctx.request.body.content.metadata.namespace
        );
    
        return await strapi.query(type).update(ctx.params, ctx.request.body);
      },
    
      async createIngressSync(ctx) {
        const ns = await strapi
          .query('namespace')
          .findOne({ id: ctx.request.body.namespace });
        const k8s_cluster_id = ns.registry.id;
        const k8s_cluster_ns = ns.name;
        const k8s_cluster_type = k8s;
    
        const kc = await await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          k8s_cluster_id,
          k8s_cluster_type
        );
        const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);
    
        try {
          delete ctx.request.body.content.metadata.creationTimestamp;
          delete ctx.request.body.content.metadata.managedFields;
        } catch (error) {}
    
        try {
          await k8sApi.createNamespacedIngress(
            k8s_cluster_ns,
            ctx.request.body.content
          );
        } catch (error) {
          strapi.log.info(error.response.body.message);
          throw new Error(error.response.body.message);
        }
        const res = await k8sApi.readNamespacedIngress(
          ctx.request.body.content.metadata.name,
          ctx.request.body.content.metadata.namespace
        );
        ctx.request.body.content = res.body;
        ctx.request.body.uid = res.body?.metadata?.uid;
        return await strapi.query(type).create(ctx.request.body);
      },
    
      async deleteIngressSync(ctx) {
        const id = ctx.params.id;
        const data = await strapi.query(type).findOne({ id: id });
    
        const kc = await await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          data.namespace.registry,
          'k8s'
        );
        const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);
    
        try {
          await k8sApi.deleteNamespacedIngress(
            data.content.metadata.name,
            data.namespace.name
          );
        } catch (error) {
          strapi.log.info(error.response.body.message);
        }
    
        return await strapi.query(type).delete({ id: id });
      },
});
