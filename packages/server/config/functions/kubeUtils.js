'use strict';

module.exports = {
  async getKubeEntitys(ctx, type) {
    const k8s_cluster_id = ctx.headers.schema_id || '';
    const k8s_cluster_ns = ctx.headers.namespace || '';

    if (type == 'ingress') {
      if (ctx.params._where) {
        if (k8s_cluster_ns != '_all') {
          const ns = await strapi
            .query('namespace')
            .findOne({ registry: k8s_cluster_id, name: k8s_cluster_ns });
          ctx.params._where.namespace = ns.id;
        } else {
          const iNS = await strapi
            .query('registry')
            .findOne({ id: k8s_cluster_id });
          ctx.params._where.namespace_in = iNS.namespaces.map((e) => e.id);
        }
      } else {
        if (k8s_cluster_ns != '_all') {
          const ns = await strapi
            .query('namespace')
            .findOne({ registry: k8s_cluster_id, name: k8s_cluster_ns });
          ctx.params.namespace = ns.id;
        } else {
          const iNS = await strapi
            .query('registry')
            .findOne({ id: k8s_cluster_id });
          ctx.params.namespace_in = iNS.namespaces.map((e) => e.id);
        }
      }
    } else {
      if (ctx.params._where) {
        ctx.params._where.registry = k8s_cluster_id;
        if (k8s_cluster_ns != '_all') {
          ctx.params._where.namespace = k8s_cluster_ns;
        }
      } else {
        ctx.params.registry = k8s_cluster_id;
        if (k8s_cluster_ns != '_all') {
          ctx.params.namespace = k8s_cluster_ns;
        }
      }
    }
    const values = await strapi.query(type).find(ctx.params);
    const totalCount = await strapi.query(type).count(ctx.params);

    return { values, aggregate: { totalCount } };
  },

  async getAllKubeEntitys(ctx, type) {
    const values = await strapi.query(type).find(ctx.params);
    const totalCount = await strapi.query(type).count(ctx.params);

    return { values, aggregate: { totalCount } };
  },

  async initKubeEntitys(ctx, type, res, id) {
    const k8s_cluster_id = ctx.headers.schema_id || '';

    res.body.items.map((s) => s.metadata.uid);
    let query = { registry: k8s_cluster_id };
    if (type == 'ingress') {
      const iNS = await strapi
        .query('registry')
        .findOne({ id: k8s_cluster_id });
      query = { namespace_in: iNS.namespaces.map((e) => e.id) };
    }
    const dbDatas = await strapi.query(type).find(query);

    for (const item of res.body.items) {
      const dbData = dbDatas.find((a) => {
        return a.uid == item.metadata.uid;
      });
      if (dbData) {
        if (
          !dbData.content.metadata.resourceVersion ||
          !item.metadata.resourceVersion ||
          dbData.content.metadata.resourceVersion !==
            item.metadata.resourceVersion ||
          id
        ) {
          dbData.content = item;
          await strapi.query(type).update({ id: dbData.id }, dbData);
        }
      } else {
        const data = {
          name: item.metadata.name,
          namespace: item.metadata.namespace,
          uid: item.metadata.uid,
          content: item,
          registry: k8s_cluster_id,
        };

        if (type == 'ingress') {
          const ns = await strapi.query('namespace').findOne({
            registry: k8s_cluster_id,
            name: item.metadata.namespace,
          });
          data.namespace = ns.id;
        }

        await strapi.query(type).create(data);
      }
    }
    return true;
  },
};
