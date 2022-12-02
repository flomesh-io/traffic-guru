'use strict';

const k8s = require('@kubernetes/client-node');

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      await strapi.services.certificates.syncK8s(data);
    },
    beforeUpdate: async (params, data) => {
      await strapi.services.certificates.syncK8s(data);
    },
    beforeDelete: async (params) => {
      try {
        const data = await strapi
          .query('certificates')
          .findOne({ id: params.id });

        const kc = await strapi.services.kubernetes.getKubeConfig(
          data.namespace.registry,
          'k8s'
        );
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        await k8sApi.deleteNamespacedSecret(data.name, data.namespace.name);
      } catch (error) {
        strapi.log.error(error);
      }
    },
  },
};
