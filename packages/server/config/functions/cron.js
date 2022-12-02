'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 */
const k8s = require('@kubernetes/client-node');

async function syncRegistries() {
  if (process.env.DISABLE_SYNCREGISTRIES) return;
  const all = await strapi.query('registry').find();
  for (const data of all) {
    try {
      strapi.services.registry.sync(data);
    } catch (err) {
      strapi.log.error(err.message);
    }
  }
}

async function syncOsm() {
  if (process.env.DISABLE_SYNCOSM) return;
  try {
    const registries = await strapi.query('registry').find({ type: 'k8s' });
    for (const registry of registries) {
      const kc = await strapi.services.kubernetes.getKubeConfig(
        registry.id,
        registry.type
      );
      const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
      const k8sCRDApi = kc.makeApiClient(k8s.CustomObjectsApi);
      const developments = await k8sApi.listDeploymentForAllNamespaces(
        null,
        null,
        'metadata.name=osm-controller',
        'app.kubernetes.io/instance=osm'
      );
      for (const item of developments.body.items) {
        const mesh = await strapi.query('mesh').findOne({
          name: item.metadata.labels.meshName,
          namespace_in: registry.namespaces.map((n) => n.id),
        });
        if (mesh) continue;
        let ns = await strapi
          .query('namespace')
          .findOne({ name: item.metadata.namespace, registry: registry.id });
        if (!ns) {
          ns = await strapi
            .query('namespace')
            .create({ name: item.metadata.namespace, registry: registry.id });
        }

        const res = await k8sCRDApi.getNamespacedCustomObject(
          'config.openservicemesh.io',
          'v1alpha2',
          item.metadata.namespace,
          'meshconfigs',
          'osm-mesh-config'
        );

        await strapi.query('mesh').create({
          name: item.metadata.labels.meshName,
          config: res.body,
          namespace: ns.id,
        });
      }
    }
  } catch (error) {
    strapi.log.error(error);
  }
}

module.exports = {
  '*/50 * * * * *': syncRegistries,
  '*/40 * * * * *': syncOsm,
};
