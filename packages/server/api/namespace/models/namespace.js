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

      try {
        const kc = await strapi.services.kubernetes.getKubeConfig(
          ns.registry.id,
          'k8s'
        );
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        const nsK8 = await k8sApi.readNamespace(ns.name);
  
        delete nsK8.body.spec
        delete nsK8.body.status
        delete nsK8.body.metadata.creationTimestamp
        delete nsK8.body.metadata.managedFields
  
        if (data.bindMesh && !ns.bindMesh) {
          strapi.log.info("Bind Mesh")
          const mesh = await strapi.query('mesh').findOne({ id: data.bindMesh });
          if (!nsK8.body.metadata) nsK8.body.metadata = {}
          if (!nsK8.body.metadata.labels) nsK8.body.metadata.labels = {}
          nsK8.body.metadata.labels["openservicemesh.io/monitored-by"] = mesh.name;
          if (!nsK8.body.metadata.annotations) nsK8.body.metadata.annotations = {}
          nsK8.body.metadata.annotations["openservicemesh.io/metrics"] = "enabled";
          nsK8.body.metadata.annotations["openservicemesh.io/sidecar-injection"] = "enabled";
          await k8sApi.replaceNamespace(ns.name, nsK8.body);
  
        } else if (!data.bindMesh && ns.bindMesh) {
          strapi.log.info("UnBind Mesh")
          if (nsK8.body.metadata.labels && nsK8.body.metadata.labels["openservicemesh.io/monitored-by"]) {
            nsK8.body.metadata.labels["openservicemesh.io/monitored-by"] = undefined;
          }
          if (nsK8.body.metadata.annotations && nsK8.body.metadata.annotations["openservicemesh.io/metrics"]) {
            nsK8.body.metadata.annotations["openservicemesh.io/metrics"] = undefined;
          }
          if (nsK8.body.metadata.annotations && nsK8.body.metadata.annotations["openservicemesh.io/sidecar-injection"]) {
            nsK8.body.metadata.annotations["openservicemesh.io/sidecar-injection"] = undefined;
          }
          await k8sApi.replaceNamespace(ns.name, nsK8.body);
  
        }
      } catch {
      }

    },
  },
};
