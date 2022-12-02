'use strict';

const k8s = require('@kubernetes/client-node');
const type = 'service';

module.exports = {
  async getServices(ctx) {
    return await strapi.config.functions.kubeUtils.getKubeEntitys(ctx, type);
  },

  async getAllServices(ctx) {
    return await strapi.config.functions.kubeUtils.getAllKubeEntitys(ctx, type);
  },

  async fetchServices(ctx, id) {
    if (id) {
      const values = await strapi.query('service').findOne({ id: id });
      if (values) {
        ctx.headers.schema_id = values.registry.id;
        ctx.headers.namespace = values.namespace;
      }
    }
    const k8s_cluster_id = ctx.headers.schema_id || '';
    const k8s_cluster_ns = ctx.headers.namespace || '';
    const k8s_cluster_type = ctx.headers.schema_type || '';
    const kc = await strapi.services.kubernetes.getKubeConfig(
      k8s_cluster_id,
      k8s_cluster_type
    );
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    let res;
    if (id) {
      const values = await strapi.query('service').findOne({ id: id });
      if (values) {
        res = await k8sApi.readNamespacedService(
          values.content.metadata.name,
          values.namespace
        );
      }
      if (!res) {
        await strapi.query('service').update({ id: id }, { delete: 1 });
        return;
      }
      res.body = { items: [res.body] };
    } else if (k8s_cluster_ns && k8s_cluster_ns !== '_all') {
      res = await k8sApi.listNamespacedService(k8s_cluster_ns);
    } else {
      res = await k8sApi.listServiceForAllNamespaces();
    }
    return await strapi.config.functions.kubeUtils.initKubeEntitys(
      ctx,
      type,
      res,
      id
    );
  },
  async fetchAllServices(ctx) {
    const registries = await strapi.query('registry').find({ type: 'k8s' });

    for (const registry of registries) {
      const kc = await strapi.services.kubernetes.getKubeConfig(
        registry.id,
        'k8s'
      );
      const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
      const res = await k8sApi.listServiceForAllNamespaces();
      ctx.headers.schema_id = registry.id;
      ctx.headers.namespace = '';
      await strapi.config.functions.kubeUtils.initKubeEntitys(ctx, type, res);
    }

    return true;
  },
  async updateServiceSync(ctx) {
    const k8s_cluster_id = ctx.headers.schema_id || '';
    const k8s_cluster_type = ctx.headers.schema_type || '';

    if (k8s_cluster_type == 'kubernetes' || k8s_cluster_type == 'k8s') {
      const kc = await strapi.services.kubernetes.getKubeConfig(
        k8s_cluster_id,
        k8s_cluster_type
      );
      const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
      try {
        delete ctx.request.body.content.metadata.creationTimestamp;
        delete ctx.request.body.content.metadata.managedFields;

        await k8sApi.replaceNamespacedService(
          ctx.request.body.content.metadata.name,
          ctx.request.body.content.metadata.namespace,
          ctx.request.body.content
        );
      } catch (error) {
        strapi.log.error(error);
        throw new Error(error?.response?.body?.message);
      }
    }
    const serviceDB = await strapi
      .query(type)
      .update(ctx.params, ctx.request.body);

    if (k8s_cluster_type == 'kubernetes' || k8s_cluster_type == 'k8s') {
      const kc = await strapi.services.kubernetes.getKubeConfig(
        k8s_cluster_id,
        k8s_cluster_type
      );
      const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
      try {
        const service = await k8sApi.readNamespacedService(
          ctx.request.body.content.metadata.name,
          ctx.request.body.content.metadata.namespace
        );
        const labelSelector =
          Object.keys(service.body.spec.selector)[0] +
          '=' +
          service.body.spec.selector[
            Object.keys(service.body.spec.selector)[0]
          ];
        const pods = await k8sApi.listNamespacedPod(
          ctx.request.body.content.metadata.namespace,
          null,
          null,
          null,
          null,
          labelSelector
        );
        for (const pod of pods.body.items) {
          const initContainer =
            pod.spec.initContainers &&
            pod.spec.initContainers.filter((c) => c.name == 'sidecar-init');
          if (!initContainer) {
            await k8sApi.deleteNamespacedPod(
              pod.metadata.name,
              pod.metadata.namespace
            );
          }
        }
      } catch (error) {
        strapi.log.error(error);
      }
    }
    return serviceDB;
  },

  async createServiceSync(ctx) {
    const k8s_cluster_id = ctx.request.body.registry || '';
    const k8s_cluster_type = ctx.headers.schema_type || '';
    const k8s_cluster_ns = ctx.request.body.namespace || '';

    const kc = await strapi.services.kubernetes.getKubeConfig(
      k8s_cluster_id,
      k8s_cluster_type
    );
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    try {
      delete ctx.request.body.content.metadata.creationTimestamp;
      delete ctx.request.body.content.metadata.managedFields;
    } catch (error) {
      strapi.log.error(error);
    }

    await k8sApi.createNamespacedService(
      k8s_cluster_ns,
      ctx.request.body.content
    );
    const res = await k8sApi.readNamespacedService(
      ctx.request.body.content.metadata.name,
      ctx.request.body.content.metadata.namespace
    );
    ctx.request.body.content = res.body;
    const ns = await strapi
      .query('namespace')
      .findOne({ registry: k8s_cluster_id, name: k8s_cluster_ns });
    ctx.request.body.ns = ns?.id;
    return await strapi.query(type).create(ctx.request.body);
  },

  async deleteServiceSync(ctx) {
    const k8s_cluster_id = ctx.headers.schema_id || '';
    const k8s_cluster_type = ctx.headers.schema_type || '';

    const kc = await strapi.services.kubernetes.getKubeConfig(
      k8s_cluster_id,
      k8s_cluster_type
    );
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const id = ctx.params.id;
    const values = await strapi.query(type).findOne({ id: id });

    await k8sApi.deleteNamespacedService(
      values.content.metadata.name,
      values.namespace
    );

    return await strapi.query(type).delete({ id: id });
  },
};
