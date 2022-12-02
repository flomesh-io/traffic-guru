'use strict';

const k8s = require('@kubernetes/client-node');
const type = 'ingress';

module.exports = {
  async getIngresses(ctx) {
    return await strapi.config.functions.kubeUtils.getKubeEntitys(ctx, type);
  },
  async fetchIngresses(ctx, id) {
    const k8s_cluster_id = ctx.headers.schema_id || '';
    const k8s_cluster_type = ctx.headers.schema_type || '';
    const k8s_cluster_ns = ctx.headers.namespace || '';
    const kc = await strapi.services.kubernetes.getKubeConfig(
      k8s_cluster_id,
      k8s_cluster_type
    );
    const k8sApi = kc.makeApiClient(k8s.NetworkingV1Api);

    let res;
    if (id) {
      const values = await strapi.query('ingress').findOne({ id: id });
      if (values) {
        res = await k8sApi.readNamespacedIngress(
          values.content.metadata.name,
          values.namespace.name
        );
      }
      if (!res) {
        await strapi.query('ingress').update({ id: id }, { delete: 1 });
        return;
      }
      res.body = { items: [res.body] };
    } else if (k8s_cluster_ns && k8s_cluster_ns !== '_all') {
      res = await k8sApi.listNamespacedIngress(k8s_cluster_ns);
    } else {
      res = await k8sApi.listIngressForAllNamespaces();
    }
    return await strapi.config.functions.kubeUtils.initKubeEntitys(
      ctx,
      type,
      res,
      id
    );
  },
  async updateIngressSync(ctx) {
    const id = ctx.params.id;
    const data = await strapi.query(type).findOne({ id: id });

    const kc = await strapi.services.kubernetes.getKubeConfig(
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

    const kc = await strapi.services.kubernetes.getKubeConfig(
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

    const kc = await strapi.services.kubernetes.getKubeConfig(
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
};
