'use strict';

const https = require("https");
const axios = require("axios");
const YAML = require('yaml');

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
          dbData.selector = item.spec?.selector?.app
          delete dbData.serviceExport
          await strapi.query(type).update({ id: dbData.id }, dbData);
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
          const ns = await strapi.query('namespace').findOne({
            registry: k8s_cluster_id,
            name: item.metadata.namespace,
          });
          data.namespace = ns.id;
        } else if (type == 'service') {
          const ns = await strapi.query('namespace').findOne({
            registry: k8s_cluster_id,
            name: item.metadata.namespace,
          });
          data.ns = ns.id;
        }

        await strapi.query(type).create(data);
      }
    }
    return true;
  },

  getK8sAxios(reg) {
    if (!reg?.address?.length) {
      throw new Error("The cluster is not registered.");
    }

    const json = YAML.parse(reg.config)
    const context = json.contexts.find((e) => e.name == json['current-context']);
    const cluster = json.clusters.find((e) => e.name == context.context.cluster);
    const user = json.users.find((e) => e.name == context.context.user);

    if (user?.user?.token) {
      return axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        baseURL: cluster.cluster.server,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.user.token,
        },
      });
    } else {
      const cert = new Buffer.from(user.user["client-certificate-data"], "base64").toString() ;
      const key = new Buffer.from(user.user["client-key-data"], "base64").toString();
      
      return axios.create({
        httpsAgent: new https.Agent({ cert, key, rejectUnauthorized: false}),
        baseURL: cluster.cluster.server,
        headers: {
          "Content-Type": "application/json"
        },
      });
    }

  }
};
