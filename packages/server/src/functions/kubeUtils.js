'use strict';

module.exports = {
  async getKubeEntitys(ctx, type, args) {
    const k8s_cluster_id = ctx.koaContext.request.header.schema_id || '';
    const k8s_cluster_ns = ctx.koaContext.request.header.namespace || '';

    
    if (type == 'ingress') {
        if (k8s_cluster_ns !== '_all') {
          const ns = await strapi.db
            .query('api::namespace.namespace')
            .findOne({where: { registry: k8s_cluster_id, name: k8s_cluster_ns }});
            args.filters.namespace = ns.id;
        } else {
          const iNS = await strapi.db
            .query('api::registry.registry')
            .findOne({where: { id: k8s_cluster_id }, populate: true});
            args.filters.namespace = iNS.namespaces.map((e) => e.id);
        }
    } else {
      if (args.filters) {
        args.filters.registry = k8s_cluster_id
        if (k8s_cluster_ns !== '_all') {
          args.filters.namespace = k8s_cluster_ns
        }
      }
    }
    return await strapi.db.query("api::" + type + "." + type).findMany(args);
  },

  async initKubeEntitys(ctx, type, res, id) {
    const k8s_cluster_id = ctx.koaContext.request.header.schema_id || '';

    res.body.items.map((s) => s.metadata.uid);
    const query = {where: { registry: k8s_cluster_id }};
    if (type == 'ingress') {
      const iNS = await strapi.db
        .query('api::registry.registry')
        .findOne({where: { id: k8s_cluster_id }, populate: true});
      query.where["namespace"] = iNS.namespaces.map((e) => e.id)
    }
    const dbDatas = await strapi.db.query("api::" + type + "." + type).findMany(query);
    
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
          dbData.selector = item.spec?.selector?.app
          await strapi.db.query("api::" + type + "." + type).update({where: { id: dbData.id }, data: dbData});
        }
      } else {
        const data = {
          name: item.metadata.name,
          namespace: item.metadata.namespace,
          uid: item.metadata.uid,
          content: item,
          registry: k8s_cluster_id,
          selector: item.spec?.selector?.app
        };
        
        if (type == 'ingress') {
          const ns = await strapi.db.query('api::namespace.namespace').findOne({where: {
            registry: k8s_cluster_id,
            name: item.metadata.namespace,
          }});
          data.namespace = ns.id;
        } else if (type == 'service') {
          const ns = await strapi.db.query('api::namespace.namespace').findOne({where: {
            registry: k8s_cluster_id,
            name: item.metadata.namespace,
          }});
          data.ns = ns.id;
        }

        await strapi.db.query("api::" + type + "." + type).create({data});
      }
    }
    return true;
  },
};
