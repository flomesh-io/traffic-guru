'use strict';

const k8s = require('@kubernetes/client-node');
const axios = require('axios');
const https = require('https');
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
const clusterIdCache = {};

module.exports = {
  async getCurrentKubernetesConfig() {
    const fleet = await strapi.query('fleet').findOne({ id: 1 });
    if (!fleet) {
      return undefined;
    }
    const conf = fleet.content;
    return {
      server: conf.server,
      certificate_authority_data: conf.certificate_authority_data,
      user: conf.user,
      token: conf.token,
      dashboard_server: conf.dashboard_server,
    };
  },

  // eslint-disable-next-line no-unused-vars
  async getKubeConfig(clusterId, type) {
    const registry = await strapi.query("registry").findOne({id: clusterId})
    if (!registry) throw new Error("Please set and select a registry");

    const kc = new k8s.KubeConfig();
    if (registry.config) {
      kc.loadFromString(registry.config);
    } else {
      const conf = await strapi.services.registry.getK8sConfig(clusterId);
  
      const cluster = {
        name: 'cluster-name',
        cluster: {
          'certificate-authority-data': conf.certificate_authority_data,
          server: conf.server,
          skipTLSVerify: true,
        },
      };
      const user = {
        name: conf.user,
        user: {
          token: conf.token,
        },
      };
      const context = {
        name: 'context-name',
        context: {
          user: user.name,
          cluster: cluster.name,
        },
      };
  
      kc.loadFromOptions({
        clusters: [cluster],
        users: [user],
        contexts: [context],
        currentContext: context.name,
      });
    }
    return kc;
  },

  async kubeDashboardProxy(ctx) {
    const k8s_cluster_id = ctx.headers.schema_id || '';

    const registry = await strapi.services.registry.findOne({
      id: k8s_cluster_id,
    });
    if (!registry || !registry.address) {
      strapi.log.error('No address is set.', registry.address);
      ctx.response.status = 404;
      return;
    }

    const address = registry.address.split(':');
    if (!address.length || address.length != 3) {
      ctx.response.status = 405;
      return;
    }

    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      let kube_dashboard_server =
        address[0] +
        ':' +
        address[1] +
        ':' +
        (registry.content.dashboardPort
          ? registry.content.dashboardPort
          : '30443');
      if (address[1].indexOf('kubernetes.default.svc') > -1) {
        kube_dashboard_server =
          'https://kubernetes-dashboard.kubernetes-dashboard.svc:443';
      }

      const url = kube_dashboard_server + '/' + decodeURI(ctx.query.url);
      const method = ctx.request.method;
      const token = registry.content.credit;
      if (!clusterIdCache[k8s_cluster_id]) {
        await lock.acquire(k8s_cluster_id, async () => {
          if (!clusterIdCache[k8s_cluster_id]) {
            const jweToken = await this.kubeDashboardLogin(
              kube_dashboard_server,
              token
            );
            const timestamp = Math.floor(+new Date() / 1000);
            clusterIdCache[k8s_cluster_id] = {
              jweToken,
              timestamp,
            };
          }
        });
      } else {
        const last_updated_timestamp = clusterIdCache[k8s_cluster_id].timestamp;
        const current_timestamp = Math.floor(+new Date() / 1000);
        if (current_timestamp - last_updated_timestamp > 240) {
          await lock.acquire(k8s_cluster_id, async () => {
            clusterIdCache[k8s_cluster_id].jweToken =
              await this.kubeDashboardLogin(kube_dashboard_server, token);
            clusterIdCache[k8s_cluster_id].timestamp = Math.floor(
              +new Date() / 1000
            );
          });
        }
      }
      const response = await axios({
        method: method,
        url: url,
        headers: {
          jweToken: clusterIdCache[k8s_cluster_id].jweToken,
          Cookie: 'authMode=token',
        },
        httpsAgent: agent,
      });

      ctx.response.body = response.data;
    } catch (error) {
    }
  },

  async kubeDashboardLogin(kube_dashboard_server, token) {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const csrfUrl = kube_dashboard_server + '/api/v1/csrftoken/login';
    let response = await axios({
      method: 'get',
      url: csrfUrl,
      headers: {
        Accept: 'application/json, text/plain, */*',
        Cookie: 'authMode=token',
      },
      httpsAgent: agent,
    });
    const csrfToken = response.data.token;

    const loginUrl = kube_dashboard_server + '/api/v1/login';

    response = await axios({
      method: 'post',
      url: loginUrl,
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Cookie: 'authMode=token',
        Accept: 'application/json, text/plain, */*',
      },
      data: {
        token: token,
      },
      httpsAgent: agent,
    });

    return response.data.jweToken;
  },

  async getK8sItems(ctx) {
    const clusterId = ctx.headers.schema_id || '';
    const type = ctx.params.type;
    const kc = await strapi.services.kubernetes.getKubeConfig(
      clusterId,
      "k8s"
    );

    const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    const k8sBatchApi = kc.makeApiClient(k8s.BatchV1Api);
    const k8sAppApi = kc.makeApiClient(k8s.AppsV1Api);
    let items = null;
    let metricsAll = null;
    if (ctx.params && ctx.params.namespace) {
      if (type == "pod") {
        items = await k8sCoreApi.listNamespacedPod(
          ctx.params.namespace
        );
        metricsAll = await strapi.query("metrics").find({registry: clusterId, namespace: ctx.params.namespace, _sort: "time:asc", _limit: -1})
      } else if (type == "cronjob") {
        items = await k8sBatchApi.listNamespacedCronJob(
          ctx.params.namespace
        );
      } else if (type == "daemonset") {
        items = await k8sAppApi.listNamespacedDaemonSet(
          ctx.params.namespace
        );
        const names = items.body.items.map((i) => i.metadata.name + "-")
        metricsAll = await strapi.query("metrics").find({registry: clusterId, name_containss: names, namespace: ctx.params.namespace, _sort: "time:asc", _limit: -1})
      } else if (type == "deployment") {
        items = await k8sAppApi.listNamespacedDeployment(
          ctx.params.namespace
        );
        const names = items.body.items.map((i) => i.metadata.name + "-")
        metricsAll = await strapi.query("metrics").find({registry: clusterId, name_containss: names, namespace: ctx.params.namespace, _sort: "time:asc", _limit: -1})
      } else if (type == "job") {
        items = await k8sBatchApi.listNamespacedJob(
          ctx.params.namespace
        );
      } else if (type == "replicaset") {
        items = await k8sAppApi.listNamespacedReplicaSet(
          ctx.params.namespace
        );
        const names = items.body.items.map((i) => i.metadata.name + "-")
        metricsAll = await strapi.query("metrics").find({registry: clusterId, name_containss: names, namespace: ctx.params.namespace, _sort: "time:asc", _limit: -1})
      } else if (type == "replicationcontroller") {
        items = await k8sCoreApi.listNamespacedReplicationController(
          ctx.params.namespace
        );
      } else if (type == "statefulset") {
        items = await k8sAppApi.listNamespacedStatefulSet(
          ctx.params.namespace
        );
        const names = items.body.items.map((i) => i.metadata.name + "-")
        metricsAll = await strapi.query("metrics").find({registry: clusterId, name_containss: names, namespace: ctx.params.namespace, _sort: "time:asc", _limit: -1})
      } 
    } else {
      if (type == "pod") {
        items = await k8sCoreApi.listPodForAllNamespaces();
        metricsAll = await strapi.query("metrics").find({registry: clusterId, _sort: "time:asc", _limit: -1})
      } else if (type == "cronjob") {
        items = await k8sBatchApi.listCronJobForAllNamespaces();
      } else if (type == "daemonset") {
        items = await k8sAppApi.listDaemonSetForAllNamespaces();
        const names = items.body.items.map((i) => i.metadata.name + "-")
        metricsAll = await strapi.query("metrics").find({registry: clusterId, name_containss: names, _sort: "time:asc", _limit: -1})
      } else if (type == "deployment") {
        items = await k8sAppApi.listDeploymentForAllNamespaces();
        const names = items.body.items.map((i) => i.metadata.name + "-")
        metricsAll = await strapi.query("metrics").find({registry: clusterId, name_containss: names, _sort: "time:asc", _limit: -1})
      } else if (type == "job") {
        items = await k8sBatchApi.listJobForAllNamespaces();
      } else if (type == "replicaset") {
        items = await k8sAppApi.listReplicaSetForAllNamespaces();
        const names = items.body.items.map((i) => i.metadata.name + "-")
        metricsAll = await strapi.query("metrics").find({registry: clusterId, name_containss: names, _sort: "time:asc", _limit: -1})
      } else if (type == "replicationcontroller") {
        items = await k8sCoreApi.listReplicationControllerForAllNamespaces();
      } else if (type == "statefulset") {
        items = await k8sAppApi.listStatefulSetForAllNamespaces();
        const names = items.body.items.map((i) => i.metadata.name + "-")
        metricsAll = await strapi.query("metrics").find({registry: clusterId, name_containss: names, _sort: "time:asc", _limit: -1})
      }
    }

    items.body.count = items.body.items.length
    if (ctx.query.filterBy) {
      const item = ctx.query.filterBy.split(",")[0]
      const value = ctx.query.filterBy.split(",")[1]
      items.body.items = items.body.items.filter((p) => p.metadata[item].indexOf(value) > -1)
    }
    if (ctx.query.sortBy) {
      const order = ctx.query.sortBy.split(",")[0]
      const field = ctx.query.sortBy.split(",")[1]
      if (order == "d") {
        items.body.items.sort((a,b) => b.metadata[field] - a.metadata[field])
      } else {
        items.body.items.sort((a,b) => a.metadata[field] - b.metadata[field])
      }
    }
    const itemsPerPage = Number(ctx.query.itemsPerPage)
    const page = Number(ctx.query.page)
    if (itemsPerPage && page) {
      items.body.items = items.body.items.slice(((page - 1) * itemsPerPage), (page * itemsPerPage))
    }

    let running = 0;
    let failed = 0;
    let succeeded = 0;
    for (const item of items.body.items) {
      switch (type) {
        case "pod":
          const metrics = await strapi.query("metrics").find({registry: clusterId, name: item.metadata.name, namespace: item.metadata.namespace,_sort: "time:asc", _limit: -1})
          item.metrics = await this.getMetricsCount(metrics)

          if (item.status.phase == 'Succeeded') {
            succeeded++;
          } else if (item.status.phase == 'Running') {
            running++;
          } else {
            failed++;
          }
          break;
        case "cronjob":
          await this.setPodInfo(kc, item, type)
          running += item.active.length
          succeeded += item.notWorking.length
          break;
        case "daemonset":
          await this.setPodInfo(kc, item, type)
          running += item.status.numberUnavailable ? 0 : 1
          failed += item.status.numberUnavailable ? 1 : 0
          break;
        case "deployment":
          await this.setPodInfo(kc, item, type)
          running += item.status.unavailableReplicas ? 0 : 1
          failed += item.status.unavailableReplicas ? 1 : 0
          break;
        case "job":
          await this.setPodInfo(kc, item, type)
          running += item.status.succeeded ? 1 : 0
          failed += item.status.succeeded ? 0 : 1
          break;
        case "replicationcontroller":
        case "replicaset":
        case "statefulset":
          await this.setPodInfo(kc, item, type)
          running += (!item.status.replicas || item.status.readyReplicas >= item.status.replicas) ? 1 : 0
          failed += (!item.status.replicas || item.status.readyReplicas >= item.status.replicas) ? 0 : 1
          break;
        default:
          break;
      }
    }
    items.body.status = {running, succeeded, failed}

    if (metricsAll) {
      items.body.metrics = await this.getMetricsCount(metricsAll, true);
    }

    ctx.response.body = items.body;
  },
  async getK8sItem(ctx) {
    const clusterId = ctx.headers.schema_id || '';
    const type = ctx.params.type;
    const name = ctx.params.name;
    const namespace = ctx.params.namespace;
    const kc = await strapi.services.kubernetes.getKubeConfig(
      clusterId,
      "k8s"
    );

    const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    const k8sBatchApi = kc.makeApiClient(k8s.BatchV1Api);
    const k8sAppApi = kc.makeApiClient(k8s.AppsV1Api);
    const k8sAutoscalingApi = kc.makeApiClient(k8s.AutoscalingV1Api);
    let item = null;
    try {
      if (type == "pod") {
        item = await k8sCoreApi.readNamespacedPod(name, namespace);
        const metrics = await strapi.query("metrics").find({registry: clusterId, name: item.body.metadata.name, namespace: item.body.metadata.namespace,_sort: "time:asc", _limit: -1})
        item.body.metrics = await this.getMetricsCount(metrics)
      } else if (type == "cronjob") {
        item = await k8sBatchApi.readNamespacedCronJob(name, namespace);
        await this.setPodInfo(kc, item.body, type)
     } else if (type == "daemonset") {
        item = await k8sAppApi.readNamespacedDaemonSet(name, namespace);
        await this.setPodInfo(kc, item.body, type)
      } else if (type == "deployment") {
        item = await k8sAppApi.readNamespacedDeployment(name, namespace);
        await this.setPodInfo(kc, item.body, type)

        const replicaSet = await k8sAppApi.listNamespacedReplicaSet(namespace);
        replicaSet.body.items = replicaSet.body.items.filter((r) => {
          for (const owner of r.metadata.ownerReferences) {
            if (owner.kind == "Deployment" && owner.name == item.body.metadata.name) {
              return true;
            }
          }
          return false;
        })
        replicaSet.body.items = replicaSet.body.items.sort((a, b) => Number(b.metadata.annotations['deployment.kubernetes.io/revision']) 
        - Number(a.metadata.annotations['deployment.kubernetes.io/revision']))

        if (replicaSet.body.items.length > 0) {
          item.body.newreplicaset = replicaSet.body.items[0]
        } else {
          item.body.newreplicaset = []
        }
        if (replicaSet.body.items.length > 1) {
          item.body.oldreplicaset = replicaSet.body.items.slice(1)
        } else {
          item.body.oldreplicaset = []
        }

        const hpa = await k8sAutoscalingApi.listNamespacedHorizontalPodAutoscaler(namespace)
        hpa.body.items = hpa.body.items.filter((h) => h.spec.scaleTargetRef.kind == "Deployment" 
        && h.spec.scaleTargetRef.name == item.body.metadata.name)
        item.body.horizontalpodautoscaler = hpa.body.items

      } else if (type == "job") {
        item = await k8sBatchApi.readNamespacedJob(name, namespace);
        await this.setPodInfo(kc, item.body, type)
      } else if (type == "replicaset") {
        item = await k8sAppApi.readNamespacedReplicaSet(name, namespace);
        await this.setPodInfo(kc, item.body, type)
      } else if (type == "replicationcontroller") {
        item = await k8sCoreApi.readNamespacedReplicationController(name, namespace);
        await this.setPodInfo(kc, item.body, type)
      } else if (type == "statefulset") {
        item = await k8sAppApi.readNamespacedStatefulSet(name, namespace);
        await this.setPodInfo(kc, item.body, type)
      } 

    } catch (error){
      strapi.log.error(error)
    }
    ctx.response.body = item ? item.body : {};
  },
  async setPodInfo(kc, item, type) {
    const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    const k8sBatchApi = kc.makeApiClient(k8s.BatchV1Api);
    let podLabel = null;
    const fieldLable = null;
    let desired = 1;

    if (type == "pod") {
    } else if (type == "cronjob") {
      const jobs = await k8sBatchApi.listNamespacedJob(
        item.metadata.namespace
      );
      const active = [];
      const notWorking = []
      for (const job of jobs.body.items) {
        if (job.metadata.labels["job-name"].indexOf(item.metadata.name + "-") == -1) continue;
        if (job.status.conditions[0].type == "Complete") {
          await this.setPodInfo(kc, job, "job")
          notWorking.push(job)
        } if (job.status.conditions[0].type == "Running") {
          await this.setPodInfo(kc, job, "job")
          active.push(job)
        }
      }
      item.active = active;
      item.notWorking = notWorking;
    } else if (type == "daemonset") {
      const nodes = await k8sCoreApi.listNode()
      desired--
      for (const node of nodes.body.items) {
        for (const condition of node.status.conditions) {
          if (condition.type == "Ready" && condition.status == "True") {
            desired++;
            break;
          }
        }
      }
      item.podInfo = {desired: desired, succeeded: 0, running: item.status.numberAvailable ? item.status.numberAvailable : 0}

    } else if (type == "deployment") {
      desired = item.spec.replicas
      item.podInfo = {desired: desired, succeeded: 0, running: item.status.availableReplicas ? item.status.availableReplicas : 0}

    } else if (type == "job") {
      podLabel = "job-name=" + item.metadata.name
    } else if (type == "replicaset") {
      desired = item.spec.replicas
      item.podInfo = {desired: desired, succeeded: 0, running: item.status.availableReplicas ? item.status.availableReplicas : 0}

    } else if (type == "replicationcontroller") {

      desired = item.status.replicas
      item.podInfo = {desired: desired, succeeded: 0, running: item.status.availableReplicas ? item.status.availableReplicas : 0}

    } else if (type == "statefulset") {

      desired = item.spec.replicas
      item.podInfo = {desired: desired, succeeded: 0, running: item.status.readyReplicas ? item.status.readyReplicas : 0}

    } 

    if (podLabel || fieldLable) {
      const pods = await k8sCoreApi.listNamespacedPod(item.metadata.namespace,null,null,null,fieldLable,podLabel);
      const succeeded = pods.body.items.filter((p) => p.status.phase == 'Succeeded')
      const running = pods.body.items.filter((p) => p.status.phase == 'Running')
      item.podInfo = {desired: desired, succeeded: succeeded.length, running: running.length}
      item.pods = pods.body.items
    }
  },

  async getMetricsCount(metrics, allFlag) {
    const metricsCount = [];
    if (!metrics || metrics.length == 0) {
      return metricsCount
    }

    if (allFlag) {
      let cpu = 0
      let memory = 0
      let time = 0
      for (const metric of metrics) {
        if (time != metric.time) {
          if (time != 0) metricsCount.push({time: time, cpu, memory})
          cpu = 0
          memory = 0
          time = metric.time
        }
        for (const container of metric.content.containers) {
          cpu = cpu + Number(container.usage.cpu.replace("n", "").replace("u", "000").replace("m", "000000"))
          memory = memory + Number(container.usage.memory.replace("Ki", "").replace("Mi", "000").replace("Gi", "000000"))
        }
      }
      metricsCount.push({time: time, cpu, memory})
    } else {
      for (const metric of metrics) {
        let cpu = 0
        let memory = 0
        for (const container of metric.content.containers) {
          cpu = cpu + Number(container.usage.cpu.replace("n", "").replace("u", "000").replace("m", "000000"))
          memory = memory + Number(container.usage.memory.replace("Ki", "").replace("Mi", "000").replace("Gi", "000000"))
        }
        metricsCount.push({time: metric.time, cpu, memory})
      }
    }
    return metricsCount;
  },
  
  async getK8sEvent(ctx) {
    let type = ctx.params.type;
    const name = ctx.params.name;
    const namespace = ctx.params.namespace;
    const clusterId = ctx.headers.schema_id || '';
    const kc = await strapi.services.kubernetes.getKubeConfig(
      clusterId,
      "k8s"
    );
    const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    if (type == "cronjob") {
      type = "CronJob";
    } else if (type == "daemonset") {
      type = "DaemonSet";
    } else {
      type = type.slice(0,1).toUpperCase() + type.slice(1);
    }
    const fieldLable = `involvedObject.kind=${type},involvedObject.name=${name}`
    const events = await k8sCoreApi.listNamespacedEvent(namespace,null,null,null,fieldLable);

    ctx.response.body = events.body
  },
};
