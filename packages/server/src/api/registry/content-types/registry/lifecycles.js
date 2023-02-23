'use strict';

const YAML = require('yaml');

module.exports = {
  beforeDelete: async (event) => {
    const { params } = event;
    // strapi.log.debug("registry::beforeDelete --> result = " + JSON.stringify(params));
    try {
      // Delete namespaces of the registry
      const nsList = await strapi.db.query('api::namespace.namespace').findMany({
        where: {
          registry: {
            id: params.where.id
          }
        }
      });
      const nsIds = [];
      for (let i = 0; i < nsList.length; i++) {
        nsIds.push(nsList[i].id);
      }
      await strapi.db.query('api::namespace.namespace').deleteMany({
        where: {
          id: {
            $in: nsIds,
          }
        }
      });
      // Delete services of the registry
      const svcList = await strapi.db.query('api::service.service').findMany({
        where: {
          registry: {
            id: params.where.id
          }
        }
      });
      const svcIds = [];
      for (let j = 0; j < svcList.length; j++) {
        svcIds.push(svcList[j].id);
      }
      await strapi.db.query('api::service.service').deleteMany({
        where: {
          id: {
            $in: svcIds,
          }
        }
      });
    } catch (error) {
      strapi.log.error(error);
    }
  },
  beforeCreate: async (event) => {
    const { data } = event.params;
    strapi.log.debug("registry::beforeCreate --> data.address = " + JSON.stringify(data.address));
    if (process.env.APP_VERSION && process.env.APP_VERSION == 'free') {
      const registry = await strapi.service('api::registry.registry').find();
      if (registry.length > 2) {
        throw new Error(
          `The current free version can only add three registries, please upgrade to pro version`
        );
      }
    }
    if (data.type == 'k8s') {
      const pingResult = await strapi.service('api::registry.registry').pingK8s(data);
      if (!pingResult.isOK) {
        throw new Error('Illegal registration information!');
      }
      if (!data.content.domain) {
        data.content.domain = "cluster.local";
      }
      const json = YAML.parse(data.config)
      const context = json.contexts.find((e) => e.name == json['current-context']);
      const cluster = json.clusters.find((e) => e.name == context.context.cluster);
      data.address = cluster.cluster.server
    } else if (data.type == 'eureka') {
      const pingResult = await strapi.service('api::registry.registry').pingEureka(data);
      if (!pingResult.isOK) {
        throw new Error('Illegal registration information!');
      }
    } else {
      throw new Error(`Invalid registry type: ${data.type}`);
    }
    const regQerys = await strapi.entityService.findMany('api::registry.registry', {
      fields: ['id', 'name', 'address', 'type'],
      filters: { address: data.address }
    });
    // strapi.log.debug("registry::beforeCreate --> regQerys = " + JSON.stringify(regQerys));
    if (!(Array.prototype.isPrototypeOf(regQerys) && regQerys.length === 0)) {
      throw new Error('The center is registered!');
    }
  },
  afterCreate: async (event) => {
    const { result } = event;
    // strapi.log.debug("registry::afterCreate --> params = " + JSON.stringify(params));
    // strapi.log.debug("registry::afterCreate --> result = " + JSON.stringify(result));
    if (result.type == 'k8s') {
      strapi.log.debug('fetch k8s namespace');
      await strapi.service('api::registry.registry').fetchK8sNamespace(result);
      // TODO::V3-->V4
      // try {
      //   await strapi.service('api::registry.registry').initK8sMetrics(result);
      // } catch (error) {
      //   strapi.log.error(error)
      // }
    } else if (result.type == 'eureka') {
      strapi.service('api::registry.registry').fetchEurekaServices(result);
    } else {
      strapi.log.info('fetch xxx namespace');
    }
  },
  afterUpdate: async (event) => {
    const { result, params } = event;
    if (result.type == 'k8s') {
      try {
        strapi.log.info('fetch k8s namespace');
        await strapi.service('api::registry.registry').fetchK8sNamespace(result);
        // TODO::V3-->V4
        // await strapi.service('api::registry.registry').initK8sMetrics(result);
      } catch (error) {
        strapi.log.error(error)
      }
    } else if (result.type == 'eureka') {
      strapi.service('api::registry.registry').fetchEurekaServices(result.id, params, true);
    }
  },
  beforeUpdate: async (event) => {
    const { params } = event;

    const data = await strapi.db.query("api::registry.registry").findOne(params.where.id);
    if (data.type == 'k8s') {
      if (data.config) {
        const json = YAML.parse(data.config)
        const context = json.contexts.find((e) => e.name == json['current-context']);
        const cluster = json.clusters.find((e) => e.name == context.context.cluster);
        data.address = cluster.cluster.server
      }
    } else if (data.type == 'eureka') {
      await strapi.service('api::registry.registry').fetchEurekaServices(
        data, true);
    } else {
      strapi.log.info('fetch xxx namespace');
    }
  },

};
