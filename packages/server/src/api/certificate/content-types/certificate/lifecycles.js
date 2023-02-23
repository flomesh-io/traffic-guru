"use strict";

const k8s = require('@kubernetes/client-node');
module.exports = {
  beforeCreate: async (event) => {
    try {
      await strapi.service('api::certificate.certificate').syncK8s(event);
    } catch {
    }
  },
  beforeUpdate: async (event) => {
    await strapi.service('api::certificate.certificate').syncK8s(event);
  },
  beforeDelete: async (event) => {
    const { result } = event;
    try {
      const data = await strapi.entityService.findOne('api::certificate.certificate', result.id, {
        populate: true
      });
      const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
        data.namespace.registry,
        'k8s'
      );
      const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
      await k8sApi.deleteNamespacedSecret(data.name, data.namespace.name);
    } catch (error) {
      strapi.log.error(error);
    }
  },
};  