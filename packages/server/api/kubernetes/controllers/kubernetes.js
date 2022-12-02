'use strict';

const k8s = require('@kubernetes/client-node');

module.exports = {
  async namespaces(ctx) {
    const clusterId = ctx.query.id;
    const k8s_schema_type = ctx.headers.schema_type || '';
    try {
      const kc = await strapi.services.kubernetes.getKubeConfig(
        clusterId,
        k8s_schema_type
      );
      const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
      const res = await k8sApi.listNamespace();
      return { data: res.body.items.map((ns) => ns.metadata.name) };
    } catch (error) {}
    return { data: ['default'] };
  },
  async kubeProxy(ctx) {
    await strapi.services.kubernetes.kubeDashboardProxy(ctx);
  },
};
