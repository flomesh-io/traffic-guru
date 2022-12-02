'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const yaml = require('js-yaml');
const KUBE_CONFIG_DIR = path.join(os.tmpdir());
const util = require('util');
const fsOpenAsync = util.promisify(fs.open);
const fsWriteFile = util.promisify(fs.writeFile);
const exec = require('child_process').exec;

const k8s = require('@kubernetes/client-node');

const KUBE_CONFIG_TPL_STR = `
{
  "apiVersion": "v1",
  "kind": "Config",
  "users": [
    {
      "name": "default",
      "user": {
        "token": ""
      }
    }
  ],
  "clusters": [
    {
      "cluster": {
        "certificate-authority-data": "",
        "server": ""
      },
      "name": "flomesh-cluster"
    }
  ],
  "contexts": [
    {
      "context": {
        "cluster": "flomesh-cluster",
        "user": "default"
      },
      "name": "default-context"
    }
  ],
  "current-context": "default-context"
}
`;
module.exports = {
  async osmInstall(result) {
    if (!result.options) return;

    if (!result.options.osm.remoteLogging.address) {
      const ch = await strapi
        .query('fleet')
        .findOne({ type: 'clickhouse', apply: true });
      if (!ch) {
        throw new Error('Please add clickhouse to the component first');
      }
      // -- Toggles Sidecar's remote logging functionality on/off for all sidecar proxies in the mesh
      result.options.osm.remoteLogging.enable = true;
      // -- Address of the remote logging service (must contain the namespace). When left empty, this is computed in helper template to "remote-logging-service.<osm-namespace>.svc.cluster.local".
      result.options.osm.remoteLogging.address = ch.content.host;
      // -- Port of the remote logging service
      result.options.osm.remoteLogging.port = ch.content.port;
      // -- The authorization for remote logging service
      const base64Str = new Buffer.from(
        ch.content.user + ':' + ch.content.password
      ).toString('base64');
      result.options.osm.remoteLogging.authorization = 'Basic ' + base64Str;
    }

    const registry = await strapi
      .query('registry')
      .findOne({ id: result.namespace.registry });

    const kubeconfigPath = path.join(
      KUBE_CONFIG_DIR,
      `${result.id}.kubeconfig`
    );
    try {
      await fsOpenAsync(kubeconfigPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        const kubeconfig = JSON.parse(KUBE_CONFIG_TPL_STR);
        kubeconfig.users[0].user.token = registry.content.credit;
        kubeconfig.clusters[0].cluster.server = registry.address;
        kubeconfig.clusters[0].cluster['certificate-authority-data'] =
          registry.content.certificate;

        await fsWriteFile(kubeconfigPath, yaml.dump(kubeconfig));
      }
    }
    const optionsPath = path.join(KUBE_CONFIG_DIR, `${result.id}.options`);
    try {
      await fsOpenAsync(optionsPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fsWriteFile(optionsPath, yaml.dump(result.options));
      }
    }

    let helmCmd = `helm install --namespace ${
      result.namespace.name
    } --kubeconfig ${kubeconfigPath} -f ${optionsPath} ${result.name} ${
      __dirname.replace('api/mesh/services', '') + 'charts/osm'
    } --create-namespace`;

    if (result.timeout) {
      helmCmd += ' --timeout ${result.timeout}';
    }
    if (result.atomic) {
      helmCmd += ' --atomic';
    }

    exec(helmCmd, function (error, stdout, stderr) {
      strapi.log.info(error, stdout, stderr, __dirname);
    });
  },
  async osmUpdate(result) {
    const registry = await strapi
      .query('registry')
      .findOne({ id: result.namespace.registry });
    const kc = await strapi.services.kubernetes.getKubeConfig(
      registry.id,
      registry.type
    );
    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    await k8sApi.replaceNamespacedCustomObject(
      'config.openservicemesh.io',
      'v1alpha2',
      result.namespace.name,
      'meshconfigs',
      'osm-mesh-config',
      result.config
    );
  },

  async setMesh(data) {
    if (!data) return;
    const registry = await strapi
      .query('registry')
      .findOne({ id: data.namespace.registry });
    if (registry.type != 'k8s') return;
    const kc = await strapi.services.kubernetes.getKubeConfig(
      registry.id,
      registry.type
    );

    // status===========
    data.status = { bootstrap: 'stop', controller: 'stop', injector: 'stop' };
    const k8sPodApi = kc.makeApiClient(k8s.CoreV1Api);
    let pods = await k8sPodApi.listNamespacedPod(
      data.namespace.name,
      null,
      null,
      null,
      null,
      'app=osm-bootstrap'
    );

    if (pods.body.items.length == 0) {
      data.status.bootstrap = 'stop';
    } else {
      data.status.bootstrap = 'running';
      for (const item of pods.body.items) {
        if (item.status.phase != 'Running') {
          data.status.bootstrap = item.status.phase.toLowerCase();
          break;
        }
      }
    }

    pods = await k8sPodApi.listNamespacedPod(
      data.namespace.name,
      null,
      null,
      null,
      null,
      'app=osm-controller'
    );
    if (pods.body.items.length == 0) {
      data.status.controller = 'stop';
    } else {
      data.status.controller = 'running';
      for (const item of pods.body.items) {
        if (item.status.phase != 'Running') {
          data.status.controller = item.status.phase.toLowerCase();
          break;
        }
      }
    }

    pods = await k8sPodApi.listNamespacedPod(
      data.namespace.name,
      null,
      null,
      null,
      null,
      'app=osm-injector'
    );
    if (pods.body.items.length == 0) {
      data.status.injector = 'stop';
    } else {
      data.status.injector = 'running';
      for (const item of pods.body.items) {
        if (item.status.phase != 'Running') {
          data.status.injector = item.status.phase.toLowerCase();
          break;
        }
      }
    }

    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    const res = await k8sApi.getNamespacedCustomObject(
      'config.openservicemesh.io',
      'v1alpha2',
      data.namespace.name,
      'meshconfigs',
      'osm-mesh-config'
    );
    data.config = res.body;
  },

  async deleteMesh(result) {
    if (!result.namespace) return;
    const registry = await strapi
      .query('registry')
      .findOne({ id: result.namespace.registry });

    const kubeconfigPath = path.join(
      KUBE_CONFIG_DIR,
      `${result.id}.kubeconfig`
    );
    try {
      await fsOpenAsync(kubeconfigPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        const kubeconfig = JSON.parse(KUBE_CONFIG_TPL_STR);
        kubeconfig.users[0].user.token = registry.content.credit;
        kubeconfig.clusters[0].cluster.server = registry.address;
        kubeconfig.clusters[0].cluster['certificate-authority-data'] =
          registry.content.certificate;

        await fsWriteFile(kubeconfigPath, yaml.dump(kubeconfig));
      }
    }
    const helmCmd = `helm uninstall -n ${result.namespace.name} --kubeconfig ${kubeconfigPath} ${result.name}  `;

    exec(helmCmd, function (error, stdout, stderr) {
      strapi.log.info(error, stdout, stderr, __dirname);
    });
  },
};
