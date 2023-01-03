'use strict';
const k8s = require('@kubernetes/client-node');

module.exports = {
  lifecycles: {
    afterCreate: async (result) => {
      if (result.registry.type == 'k8s') {
        strapi.log.info('fetch k8s service');
        strapi.services.namespace.fetchK8sService(result);

        const kc = await strapi.services.kubernetes.getKubeConfig(
          result.registry.id,
          'k8s'
        );
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        const body = {
          kind: 'Namespace',
          apiVersion: 'v1',
          metadata: {
            name: result.name,
            labels: {
              name: result.name,
            },
          },
        };
        k8sApi.createNamespace(body);
      }
    },
    beforeUpdate: async (params, data) => {
      strapi.log.info('  >>>>>> namespace before update');
      const ns = await strapi.query('namespace').findOne({ id: params.id });
      const svcs = ns.services;
      if (svcs) {
        svcs.forEach((element) => {
          strapi
            .query('service')
            .update({ id: element.id }, { organization: data.organization });
        });
      }
    },
  },
};
