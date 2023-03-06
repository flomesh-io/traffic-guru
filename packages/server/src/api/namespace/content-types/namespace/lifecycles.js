"use strict";

const k8s = require('@kubernetes/client-node');

module.exports = {
  afterCreate: (event) => {
    const { result, params } = event;
    if (params.data.regType == 'k8s') {
      strapi.log.debug('-- fetch k8s service --');
      strapi.service('api::namespace.namespace').fetchK8sService(result, params.data.regData);

    } else {
      strapi.log.debug('-- fetch xxx service --');
    }
  },
  beforeUpdate: async (event) => {
    const { params } = event;
    const { data } = event.params;
    const ns = await strapi.db.query('api::namespace.namespace').findOne({ where: {id: params.where.id}, populate: true });
    const svcs = ns.services;
    if (svcs && data.organization) {
      for (const svc of svcs) {
        await strapi.db.query('api::service.service').update({where: { id: svc.id}, data: {organization: data.organization}})
      }
    }

    try {
      const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
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
        const mesh = await strapi.db.query('api::mesh.mesh').findOne({where: { id: data.bindMesh }});
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
    } catch{
    }
  },
};  