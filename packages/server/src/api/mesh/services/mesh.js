'use strict';

/**
 * mesh service
 */

const { createCoreService } = require('@strapi/strapi').factories;

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

module.exports = createCoreService('api::mesh.mesh',{
  async osmInstall(result) {
    if (!result.options) return;

    const namespace = await strapi.db.query("api::namespace.namespace").findOne({where:{mesh: result.id}, populate: true})

    const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
      namespace.registry.id,
      'k8s'
    );
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    if (!result.options.osm.remoteLogging.address) {
      const log = await strapi.db.query('api::fleet.fleet').findOne({ where: { type: 'log', apply: true } });
      if (log == null) {
        throw new Error('Please add log to the component first');
      }
      const ch = await strapi.db.query('api::fleet.fleet').findOne({ where: { id: log.content?.bind?.id } });
      if (ch == null) {
        throw new Error('Please add clickhouse & log to the component first');
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

      if (result.mcsEnable) {
        result.options.osm.localDNSProxy.enable=true

        const res = await k8sApi.listNamespacedService(
          "kube-system", null, null, null, null, "k8s-app=kube-dns"
        );
        if (res.body.items.length) {
          result.options.osm.localDNSProxy.primaryUpstreamDNSServerIPAddr = res.body.items[0].spec.clusterIP
        }
      }
    }

    const registry = await strapi.db
      .query('api::registry.registry')
      .findOne({where: { id: namespace.registry.id }});

    const kubeconfigPath = path.join(
      KUBE_CONFIG_DIR,
      `${result.id}.kubeconfig`
    );
    try {
      await fsOpenAsync(kubeconfigPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        if (registry.config) {
          await fsWriteFile(kubeconfigPath, registry.config);
        } else {
          const kubeconfig = JSON.parse(KUBE_CONFIG_TPL_STR);
          kubeconfig.users[0].user.token = registry.content.credit;
          kubeconfig.clusters[0].cluster.server = registry.address;
          kubeconfig.clusters[0].cluster['certificate-authority-data'] =
            registry.content.certificate;
  
          await fsWriteFile(kubeconfigPath, yaml.dump(kubeconfig));
        }
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
      namespace.name
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
      if (error) {
        let message = error.message.split("\n")
        message = message.filter((m) => m.indexOf("WARNING") == -1)
        message = message.join("\n")
        strapi.db.query("api::mesh.mesh").update({where: {id: result.id}, data: {
          osmMessage: message
        }})
      }
    });

    if (result.mcsEnable) {
      let helmFsmCmd = `helm repo add fsm https://charts.flomesh.io && helm install --namespace ${namespace.name} --kubeconfig ${kubeconfigPath} --set fsm.logLevel=5 --version=0.2.0 fsm fsm/fsm --create-namespace`;

      if (result.timeout) {
        helmFsmCmd += ' --timeout ${result.timeout}';
      }
      if (result.atomic) {
        helmFsmCmd += ' --atomic';
      }

      exec(helmFsmCmd, function (error, stdout, stderr) {
        strapi.log.info(error, stdout, stderr, __dirname);
        if (error) {
          let message = error.message.split("\n")
          message = message.filter((m) => m.indexOf("WARNING") == -1)
          message = message.join("\n")
          strapi.db.query("api::mesh.mesh").update({where: {id: result.id}, data: {
            fsmMessage: message
          }})
        }

         const addCluster = async () => {
          const res = await k8sApi.readNamespacedService(
            'fsm-ingress-pipy-controller',
            namespace.name
          );
          const name = "cluster" + registry.id;
          const cluster = {
            apiVersion: 'flomesh.io/v1alpha1',
            kind: 'Cluster',
            metadata: {
              name: name,
            },
            spec: {
              gatewayHost: res.body.status.loadBalancer.ingress[0].ip,
              gatewayPort: res.body.spec.ports[0].port,
              kubeconfig: registry.config,
            },
          };
      
          const registryMain = await strapi.db
            .query('api::registry.registry')
            .findOne({ where: {type: "k8s"}, orderBy: {createdAt: 'asc'} });
          const kcMain = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
            registryMain.id,
            'k8s'
          );
          const k8sCustomApi = kcMain.makeApiClient(k8s.CustomObjectsApi);
          try {
      
            const res = await k8sCustomApi.listClusterCustomObject(
              'flomesh.io',
              'v1alpha1',
              'clusters',
              null,
              null,
              "metadata.name=" + name
            );
      
            if (res.body.items.length == 0) {
              await k8sCustomApi.createClusterCustomObject(
                'flomesh.io',
                'v1alpha1',
                'clusters',
                cluster
              );
            }
          } catch (error) {
            strapi.log.error(error)
          }
          strapi.log.info('add cluster', res.body.status.loadBalancer);
         };
        addCluster();
      });
    }
  },
  async osmUpdate(event) {
    const data = event.params.data
    if (!data.config) return;
    const namespace = await strapi.db.query("api::namespace.namespace").findOne({where:{mesh: event.params.where.id}, populate: true})
    const registry = await strapi.db
      .query('api::registry.registry')
      .findOne({where: { id: namespace.registry.id }});
    const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
      registry.id,
      registry.type
    );
    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    await k8sApi.replaceNamespacedCustomObject(
      'config.openservicemesh.io',
      'v1alpha2',
      namespace.name,
      'meshconfigs',
      'osm-mesh-config',
      data.config
    );
  },

  async setMesh(data) {
    if (!data) return;
    // status===========
    data.status = {
      bootstrap: 'stop',
      controller: 'stop',
      injector: 'stop',
      mcs: 'stop',
    };
    if (data.status === undefined) return;
    const namespace = await strapi.db.query("api::namespace.namespace").findOne({where:{mesh: data.id}, populate: true})
    const registry = namespace.registry
    if (registry.type != 'k8s') return;
    const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
      registry.id,
      registry.type
    );

    const k8sPodApi = kc.makeApiClient(k8s.CoreV1Api);
    let pods = await k8sPodApi.listNamespacedPod(
      namespace.name,
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
      namespace.name,
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
      namespace.name,
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
      namespace.name,
      'meshconfigs',
      'osm-mesh-config'
    );

    // FSM status===========
    pods = await k8sPodApi.listNamespacedPod(
      namespace.name,
      null,
      null,
      null,
      null,
      'app.kubernetes.io/name=fsm'
    );
    if (pods.body.items.length == 0) {
      data.status.mcs = 'stop';
    } else {
      data.status.mcs = 'running';
      for (const item of pods.body.items) {
        if (item.status.phase != 'Running') {
          data.status.mcs = item.status.phase.toLowerCase();
          break;
        }
      }
    }
    data.config = res.body;
  },

  async setMeshBody(data) {
    if (!data) return;
    if (data.status === undefined) return;
    const namespace = await strapi.db.query("api::namespace.namespace").findOne({where:{mesh: data.id}, populate: true})
    const registry = namespace.registry
    if (registry.type != 'k8s') return;
    const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
      registry.id,
      registry.type
    );

    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    const res = await k8sApi.getNamespacedCustomObject(
      'config.openservicemesh.io',
      'v1alpha2',
      namespace.name,
      'meshconfigs',
      'osm-mesh-config'
    );

    data.config = res.body;
  },

  async deleteMesh(id) {
    const namespace = await strapi.db.query("api::namespace.namespace").findOne({where:{mesh: id}, populate: true})
    const mesh = await strapi.db.query("api::mesh.mesh").findOne({where:{id: id}})
    if (!namespace) return;
    const registry = namespace.registry

    const kubeconfigPath = path.join(
      KUBE_CONFIG_DIR,
      `${id}.kubeconfig`
    );
    try {
      await fsOpenAsync(kubeconfigPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        if (registry.config) {
          await fsWriteFile(kubeconfigPath, registry.config);
        } else {
          const kubeconfig = JSON.parse(KUBE_CONFIG_TPL_STR);
          kubeconfig.users[0].user.token = registry.content.credit;
          kubeconfig.clusters[0].cluster.server = registry.address;
          kubeconfig.clusters[0].cluster['certificate-authority-data'] =
            registry.content.certificate;

          await fsWriteFile(kubeconfigPath, yaml.dump(kubeconfig));
        }
      }
    }
    const helmCmd = `helm uninstall -n ${namespace.name} --kubeconfig ${kubeconfigPath} ${mesh.name}  `;

    exec(helmCmd, function (error, stdout, stderr) {
      strapi.log.info(error, stdout, stderr, __dirname);
    });

    const helmFsmCmd = `helm uninstall -n ${namespace.name} --kubeconfig ${kubeconfigPath} fsm  `;

    exec(helmFsmCmd, function (error, stdout, stderr) {
      strapi.log.info(error, stdout, stderr, __dirname);

      const delCluster = async () => {
        
        const name = "cluster" + registry.id;
        const registryMain = await strapi.db
          .query('api::registry.registry')
          .findOne({ orderBy: {createdAt: 'asc'} });
        const kcMain = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          registryMain.id,
          'k8s'
        );
        const k8sCustomApi = kcMain.makeApiClient(k8s.CustomObjectsApi);
        try {
    
          const res = await k8sCustomApi.listClusterCustomObject(
            'flomesh.io',
            'v1alpha1',
            'clusters',
            null,
            null,
            "metadata.name=" + name
          );
    
          if (res.body.items.length > 0) {
            await k8sCustomApi.deleteClusterCustomObject(
              'flomesh.io',
              'v1alpha1',
              'clusters',
              name
            );
          }
        } catch (error) {
          strapi.log.error(error)
        }
        strapi.log.info('del cluster', name);
       };
      delCluster();
    });
  },
});
