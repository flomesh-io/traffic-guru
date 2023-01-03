'use strict';

const k8s = require('@kubernetes/client-node');
const axios = require('axios');

async function syncKubernetes(data) {
  const kc = await strapi.services.kubernetes.getKubeConfig(data.id, 'k8s');
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  const fieldSelector = 'type=kubernetes.io/tls';
  const sercets = await k8sApi.listSecretForAllNamespaces(
    null,
    null,
    fieldSelector
  );

  for (const sercet of sercets.body.items) {
    const ns = await strapi
      .query('namespace')
      .findOne({ registry: data.id, name: sercet.metadata.namespace });
    if (!ns) return;
    const cert = await strapi
      .query('certificates')
      .findOne({ name: sercet.metadata.name, namespace: ns.id });

    if (!cert) {
      await strapi.query('certificates').create({
        name: sercet.metadata.name,
        type: 'k8s',
        namespace: ns.id,
        content: {
          cert: sercet.data['tls.crt'],
          key: sercet.data['tls.key'],
        },
      });
    }
  }

  // sync metrics==============
  const registry = await strapi.query('registry').findOne({ id: data.id });
  if (registry) {
    axios.defaults.timeout = 1000;
    try {
      const k8sAxios = strapi.config.functions.kubeUtils.getK8sAxios(registry);

      const response = await k8sAxios.get('/apis/metrics.k8s.io/v1beta1/pods')
      const now = new Date();
      const count = await strapi.query('metrics').count();
      if (count > 100000) {
        try {
          const knex = strapi.connections[strapi.config.database.defaultConnection];
          const clientType = strapi.config.database.connections[strapi.config.database.defaultConnection].settings.client;
          if (clientType == "mysql") {
            await knex.schema.raw(`TRUNCATE TABLE metrics;`);
          } else if (clientType == "postgres") {
            await knex.schema.raw(`TRUNCATE TABLE metrics RESTART IDENTITY;`);
          }
          
        } catch (error) {
          strapi.log.error("Sync metrics");
          strapi.log.error(error);
        }
      }
      for (const item of response.data.items) {
        await strapi.query('metrics').create({
          name: item.metadata.name,
          namespace: item.metadata.namespace,
          registry: registry.id,
          content: item,
          time: Math.round(now.getTime() / 1000),
        });
      }
      
    } catch (error){
      strapi.log.error("Get metrics");
      strapi.log.error(error)
    }
  }
}

module.exports = {
  sync: (data) => {
    const type = data.type;
    switch (type) {
      case 'k8s':
        return syncKubernetes(data);
    }
  },

  async pingK8s(data) {
    strapi.log.info('===============>>>>>> service.registry -- pingK8s ');
    const k8sApi = await this.getK8sApi(data.config);
    try {
      await k8sApi.listNamespace();
      return {
        isOK: true,
        status: 1,
      };
    } catch (error) {
      strapi.log.error(error);
      const errMsg = error.toString();
      strapi.log.error(errMsg);
      return {
        isOK: false,
        status: -1,
        error: errMsg,
      };
    }
  },

  async fetchK8sNamespace(regId) {
    const registry = await this.findOne({ id: regId });
    const k8sApi = await this.getK8sApi(registry.config);
    try {
      const result = await k8sApi.listNamespace();
      const namespaces = await strapi
        .query('namespace')
        .find({ registry: regId });
      result.body.items.forEach(async (item) => {
        if (!namespaces.find((n) => n.name == item.metadata.name)) {
          strapi.log.info('fetch new namespace: ' + item.metadata.name);
          strapi.services.namespace.create({
            name: item.metadata.name,
            registry: regId,
            regType: 'k8s',
          });
        }
      });
    } catch (error) {
      strapi.log.error(error);
    }
  },

  async getK8sConfig(id) {
    const registry = await this.findOne({ id: id });
    if (!registry) {
      strapi.log.info('oops, find nothing...');
      return undefined;
    }
    return {
      server: registry.address,
      certificate_authority_data: registry.content.certificate,
      user: 'default',
      token: registry.content.credit,
    };
  },

  async getK8sApi(conf) {
    const kc = new k8s.KubeConfig();
    kc.loadFromString(conf)
    return kc.makeApiClient(k8s.CoreV1Api);
  },

  async fetchEurekaServices(regId, data, isSync = false) {
    strapi.log.info('===========>> fetchEurekaServices');
    let ns;
    let oldSvcs;
    if (isSync) {
      ns = await await strapi.query('namespace').findOne({ registry: regId });
      oldSvcs = await strapi.query('service').find({ registry: regId });
      if (oldSvcs) {
      } else {
        isSync = false;
      }
    } else {
      ns = await strapi.services.namespace.create({
        name: 'default',
        registry: regId,
        regType: 'eureka',
      });
    }

    // basic token
    const auth = data.content.credit;
    const buf = Buffer.from(auth, 'ascii');

    const eurekaAxios = axios.create({
      baseURL: data.address,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + buf.toString('base64'),
      },
    });
    try {
      // Call eureka interface
      const response = await eurekaAxios.get('eureka/apps');
      const svcs = response.data.applications.application;
      const gatewayPort = data.content.gatewayPort,
        gatewayPath = data.content.gatewayPath;
      if (Array.prototype.isPrototypeOf(svcs) && svcs.length > 0) {
        if (isSync) {
          // Update service content and add new service
          svcs.forEach(async (item) => {
            const uid = regId + '-' + item.name;
            item.metadata = {
              uid: uid,
              name: item.name,
            };
            let isNew = true,
              isGateway = false;
            if (
              item.instance[0].port['$'] == gatewayPort &&
              item.instance[0].ipAddr == gatewayPath
            ) {
              isGateway = true;
            }
            for (let index = 0; index < oldSvcs.length; index++) {
              const oldSvc = oldSvcs[index];
              if (oldSvc.uid === uid) {
                isNew = false;
                strapi.services.service.update(
                  { uid: uid },
                  { deleted: false, content: item, isGateway: isGateway }
                );
                break;
              }
            }
            if (isNew) {
              await strapi.services.service.create({
                name: item.name,
                namespace: ns.name,
                ns: ns.id,
                registry: regId,
                content: item,
                autoCreateApp: data.autoUpstream,
                autoCreateUpstream: data.autoApplication,
                uid: uid,
                isGateway: isGateway,
              });
            }
          });
        } else {
          // Create all services
          svcs.forEach(async (item) => {
            const uid = regId + '-' + item.name;
            item.metadata = {
              uid: uid,
              name: item.name,
            };
            let isGateway = false;
            if (
              item.instance[0].port['$'] == gatewayPort &&
              item.instance[0].ipAddr == gatewayPath
            ) {
              isGateway = true;
            }
            await strapi.services.service.create({
              name: item.name,
              namespace: ns.name,
              ns: ns.id,
              registry: regId,
              content: item,
              autoCreateApp: data.autoUpstream,
              autoCreateUpstream: data.autoApplication,
              uid: uid,
              isGateway: isGateway,
            });
          });
        }
      }
    } catch (error) {
      strapi.log.error(error);
    }
  },

  async initK8sMetrics(id) {
    const registry = await strapi.query('registry').findOne({ id });
    const kc = await strapi.services.kubernetes.getKubeConfig(id, 'k8s');
    const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    const k8sAppApi = kc.makeApiClient(k8s.AppsV1Api);
    const k8sRabcApi = kc.makeApiClient(k8s.RbacAuthorizationV1Api);
    const k8sRegistrationApi = kc.makeApiClient(k8s.ApiregistrationV1Api);

    const labelSelector = 'k8s-app=metrics-server';
    const deployments = await k8sAppApi.listDeploymentForAllNamespaces(
      null,
      null,
      null,
      labelSelector
    );

    if (deployments.body.items && deployments.body.items.length > 0) {
      // Already installed
      return;
    } else {
      let installed = false;
      try {
        axios.defaults.timeout = 1000;
        const k8sAxios = strapi.config.functions.kubeUtils.getK8sAxios(registry);
        await k8sAxios.get('/apis/metrics.k8s.io/v1beta1/pods');
        installed = true;
      } catch (error) {
      }
      if (installed) {
        // Already installed
        return;
      }
    }

    strapi.log.info("Install K8s Metrics Server")

    let content = null;
    // ServiceAccount ========================
    let exists = false;
    try {
      await k8sCoreApi.readNamespacedServiceAccount(
        'metrics-server',
        'kube-system'
      );
      exists = true;
    } catch (error) {}

    if (!exists) {
      content = {
        apiVersion: 'v1',
        kind: 'ServiceAccount',
        metadata: {
          labels: {
            'k8s-app': 'metrics-server',
          },
          name: 'metrics-server',
          namespace: 'kube-system',
        },
      };
      await k8sCoreApi.createNamespacedServiceAccount('kube-system', content);
    }
    // ClusterRole system:aggregated-metrics-reader ========================
    exists = false;
    try {
      await k8sRabcApi.readClusterRole('system:aggregated-metrics-reader');
      exists = true;
    } catch (error) {}
    if (!exists) {
      content = {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'ClusterRole',
        metadata: {
          labels: {
            'k8s-app': 'metrics-server',
            'rbac.authorization.k8s.io/aggregate-to-admin': 'true',
            'rbac.authorization.k8s.io/aggregate-to-edit': 'true',
            'rbac.authorization.k8s.io/aggregate-to-view': 'true',
          },
          name: 'system:aggregated-metrics-reader',
        },
        rules: [
          {
            apiGroups: ['metrics.k8s.io'],
            resources: ['pods', 'nodes'],
            verbs: ['get', 'list', 'watch'],
          },
        ],
      };
      await k8sRabcApi.createClusterRole(content);
    } else {
    }

    // ClusterRole system:metrics-server ========================
    exists = false;
    try {
      await k8sRabcApi.readClusterRole('system:metrics-server');
      exists = true;
    } catch (error) {}
    if (!exists) {
      content = {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'ClusterRole',
        metadata: {
          labels: {
            'k8s-app': 'metrics-server',
          },
          name: 'system:metrics-server',
        },
        rules: [
          {
            apiGroups: [''],
            resources: ['nodes/metrics'],
            verbs: ['get'],
          },
          {
            apiGroups: [''],
            resources: ['pods', 'nodes'],
            verbs: ['get', 'list', 'watch'],
          },
        ],
      };
      await k8sRabcApi.createClusterRole(content);
    } else {
    }

    // RoleBinding metrics-server-auth-reader========================
    exists = false;
    try {
      await k8sRabcApi.readNamespacedRoleBinding('metrics-server-auth-reader', 'kube-system');
      exists = true;
    } catch (error) {}
    if (!exists) {
      content = {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'RoleBinding',
        metadata: {
          labels: {
            'k8s-app': 'metrics-server',
          },
          name: 'metrics-server-auth-reader',
          namespace: 'kube-system',
        },
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'Role',
          name: 'extension-apiserver-authentication-reader',
        },
        subjects: [
          {
            kind: 'ServiceAccount',
            name: 'metrics-server',
            namespace: 'kube-system',
          },
        ],
      };
      await k8sRabcApi.createNamespacedRoleBinding('kube-system', content);
    } else {
    }

    // RoleBinding system:metrics-server========================
    exists = false;
    try {
      await k8sRabcApi.readClusterRoleBinding('system:metrics-server');
      exists = true;
    } catch (error) {}
    if (!exists) {
      content = {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'ClusterRoleBinding',
        metadata: {
          labels: {
            'k8s-app': 'metrics-server',
          },
          name: 'system:metrics-server',
        },
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'ClusterRole',
          name: 'system:metrics-server',
        },
        subjects: [
          {
            kind: 'ServiceAccount',
            name: 'metrics-server',
            namespace: 'kube-system',
          },
        ],
      };
      await k8sRabcApi.createClusterRoleBinding(content);
    } else {
    }

    // Service ========================
    exists = false;
    try {
      await k8sCoreApi.readNamespacedService('metrics-server', 'kube-system');
      exists = true;
    } catch (error) {}

    if (!exists) {
      content = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
          labels: {
            'k8s-app': 'metrics-server',
          },
          name: 'metrics-server',
          namespace: 'kube-system',
        },
        spec: {
          ports: [
            {
              name: 'https',
              port: 443,
              protocol: 'TCP',
              targetPort: 'https',
            },
          ],
          selector: {
            'k8s-app': 'metrics-server',
          },
        },
      };
      await k8sCoreApi.createNamespacedService('kube-system', content);
    }

    // Deployment ========================
    exists = false;
    try {
      await k8sCoreApi.readNamespacedDeployment(
        'metrics-server',
        'kube-system'
      );
      exists = true;
    } catch (error) {}

    if (!exists) {
      content = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          labels: {
            'k8s-app': 'metrics-server',
          },
          name: 'metrics-server',
          namespace: 'kube-system',
        },
        spec: {
          selector: {
            matchLabels: {
              'k8s-app': 'metrics-server',
            },
          },
          strategy: {
            rollingUpdate: {
              maxUnavailable: 0,
            },
          },
          template: {
            metadata: {
              labels: {
                'k8s-app': 'metrics-server',
              },
            },
            spec: {
              containers: [
                {
                  args: [
                    '--cert-dir=/tmp',
                    '--secure-port=4443',
                    '--kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname',
                    '--kubelet-use-node-status-port',
                    '--metric-resolution=15s',
                    '--kubelet-insecure-tls=true',
                  ],
                  image: 'flomesh/metrics-server:v0.6.2',
                  imagePullPolicy: 'IfNotPresent',
                  livenessProbe: {
                    failureThreshold: 3,
                    httpGet: {
                      path: '/livez',
                      port: 'https',
                      scheme: 'HTTPS',
                    },
                    periodSeconds: 10,
                  },
                  name: 'metrics-server',
                  ports: [
                    {
                      containerPort: 4443,
                      name: 'https',
                      protocol: 'TCP',
                    },
                  ],
                  readinessProbe: {
                    failureThreshold: 3,
                    httpGet: {
                      path: '/readyz',
                      port: 'https',
                      scheme: 'HTTPS',
                    },
                    initialDelaySeconds: 20,
                    periodSeconds: 10,
                  },
                  resources: {
                    requests: {
                      cpu: '100m',
                      memory: '200Mi',
                    },
                  },
                  securityContext: {
                    allowPrivilegeEscalation: false,
                    readOnlyRootFilesystem: true,
                    runAsNonRoot: true,
                    runAsUser: 1000,
                  },
                  volumeMounts: [
                    {
                      mountPath: '/tmp',
                      name: 'tmp-dir',
                    },
                  ],
                },
              ],
              nodeSelector: {
                'kubernetes.io/os': 'linux',
              },
              priorityClassName: 'system-cluster-critical',
              serviceAccountName: 'metrics-server',
              volumes: [
                {
                  emptyDir: {},
                  name: 'tmp-dir',
                },
              ],
            },
          },
        },
      };
      await k8sAppApi.createNamespacedDeployment('kube-system', content);
    }

    // APIService ========================
    exists = false;
    try {
      await k8sRegistrationApi.readAPIService('v1beta1.metrics.k8s.io');
      exists = true;
    } catch (error) {}

    if (!exists) {
      content = {
        apiVersion: 'apiregistration.k8s.io/v1',
        kind: 'APIService',
        metadata: {
          labels: {
            'k8s-app': 'metrics-server',
          },
          name: 'v1beta1.metrics.k8s.io',
        },
        spec: {
          group: 'metrics.k8s.io',
          groupPriorityMinimum: 100,
          insecureSkipTLSVerify: true,
          service: {
            name: 'metrics-server',
            namespace: 'kube-system',
          },
          version: 'v1beta1',
          versionPriority: 100,
        },
      };
      await k8sRegistrationApi.createAPIService(content);
    }
  },
};
