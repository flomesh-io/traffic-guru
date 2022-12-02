'use strict';

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (process.env.APP_VERSION && process.env.APP_VERSION == 'free') {
        const registry = await strapi.query('registry').find();
        if (registry.length > 1) {
          throw new Error(
            `The current free version can only add two registries, please upgrade to pro version`
          );
        }
      }
      const regQerys = await strapi
        .query('registry')
        .find({ address: data.address });
      if (!(Array.prototype.isPrototypeOf(regQerys) && regQerys.length === 0)) {
        throw new Error('The center is registered!');
      }
      if (data.type == 'k8s') {
        const pingResult = await strapi.services.registry.pingK8s(data);
        if (!pingResult.isOK) {
          throw new Error('Illegal registration information!');
        }
      } else {
        throw new Error(`Invalid registry type: ${data.type}`);
      }
    },
    afterCreate: async (result) => {
      if (result.type == 'k8s') {
        strapi.log.info('fetch k8s namespace');
        strapi.services.registry.fetchK8sNamespace(result.id);
      } else {
        strapi.log.info('fetch xxx namespace');
      }
    },
    beforeUpdate: async (params) => {
      const result = await strapi.query('registry').findOne({ id: params.id });
      if (result.type == 'k8s') {
        strapi.log.info('fetch k8s namespace');
        await strapi.services.registry.fetchK8sNamespace(params.id);
      } else {
        strapi.log.info('fetch xxx namespace');
      }
    },
    beforeDelete: async (data) => {
      strapi.log.info('  ------> registry::beforeDelete');
      try {
        // Delete the namespace under the registry
        await strapi.query('namespace').delete({ registry: data.id });
        // Delete services under the registry
        await strapi.query('service').delete({ registry: data.id });
      } catch (error) {
        strapi.log.error(error);
      }
    },
  },
};
