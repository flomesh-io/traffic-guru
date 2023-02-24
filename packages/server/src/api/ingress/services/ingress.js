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
      async updateIngressSync(args, ctx) {
        const k8s_cluster_id = args.data.registry ||  ctx.koaContext.request.header.schema_id || '';
        const k8s_cluster_type = ctx.koaContext.request.header.schema_type || '';

        const kc = await await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          k8s_cluster_id,
          k8s_cluster_type
        );
        const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);
    
        try {
          delete args.data.content.metadata.creationTimestamp;
          delete args.data.content.metadata.managedFields;
        } catch (error) {}
    
        try {
          await k8sApi.replaceNamespacedIngress(
            args.data.content.metadata.name,
            args.data.content.metadata.namespace,
            args.data.content
          );
        } catch (error) {
          strapi.log.info(error);
          throw new Error(error?.response?.body?.message);
        }
        await k8sApi.readNamespacedIngress(
          args.data.content.metadata.name,
          args.data.content.metadata.namespace
        );
    
        return await strapi.db.query("api::" + type + "." + type).update({where: {id: args.id}, data: args.data});
      },
    
      async createIngressSync(args, ctx) {
        const k8s_cluster_id = args.data.registry ||  ctx.koaContext.request.header.schema_id || '';
        const k8s_cluster_ns = args.data.content.metadata.namespace || ctx.koaContext.request.header.namespace || '';
        const k8s_cluster_type = ctx.koaContext.request.header.schema_type || '';
    
        const kc = await await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          k8s_cluster_id,
          k8s_cluster_type
        );
        const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);
    
        try {
          delete args.data.content.metadata.creationTimestamp;
          delete args.data.content.metadata.managedFields;
        } catch (error) {}
    
        try {
          await k8sApi.createNamespacedIngress(
            k8s_cluster_ns,
            args.data.content
          );
        } catch (error) {
          strapi.log.error(error?.response?.body)
          if (error?.response?.body?.message) {
            throw new Error(error?.response?.body?.message);
          } else {
            throw new Error("Failed to deploy to k8s");
          }
        }
        const res = await k8sApi.readNamespacedIngress(
          args.data.content.metadata.name,
          args.data.content.metadata.namespace
        );
        args.data.content = res.body;
        args.data.uid = res.body?.metadata?.uid;
        return await strapi.db.query("api::" + type + "." + type).create(args);
      },
    
      async deleteIngressSync(args, ctx) {
        const values = await strapi.db.query("api::" + type + "." + type).findOne({where: { id: args.id }});
        const k8s_cluster_id = ctx.koaContext.request.header.schema_id || '';
        const k8s_cluster_type = ctx.koaContext.request.header.schema_type || '';
    
        const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          k8s_cluster_id,
          k8s_cluster_type
        );
        const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);
    
        try {
          await k8sApi.deleteNamespacedIngress(
            values.content.metadata.name,
            values.content.metadata.namespace
          );
        } catch (error) {
          strapi.log.error(error?.response?.body)
        }
    
        return await strapi.db.query("api::" + type + "." + type).delete({where: { id: args.id }});
    },
});
