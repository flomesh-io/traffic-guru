'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const k8s = require('@kubernetes/client-node');

module.exports = createCoreService('api::certificate.certificate',{
    
    async syncK8s(event) {
      const data = event.params.data
      if (data.type != 'k8s') return;
  
      try {
        const ns = await strapi.db.query('api::namespace.namespace').findOne({where: {id: event.params.data.namespace}, populate: true});
        const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          ns.registry.id,
          'k8s'
        );
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  
        let k8sHas = false;
        await k8sApi.readNamespacedSecret(data.name, ns.name);
        k8sHas = true;
  
        const body = {
          apiVersion: 'v1',
          kind: 'Secret',
          metadata: {
            name: data.name,
            namespace: ns.name,
          },
          data: {
            'tls.crt': data.content.cert,
            'tls.key': data.content.key,
          },
          type: 'kubernetes.io/tls',
        };
        if (k8sHas) {
          await k8sApi.replaceNamespacedSecret(data.name, ns.name, body);
        } else {
          await k8sApi.createNamespacedSecret(ns.name, body);
        }
      } catch {
      }
    },
});
