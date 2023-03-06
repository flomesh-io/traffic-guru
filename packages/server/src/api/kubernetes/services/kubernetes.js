'use strict';

/**
 * kubernetes service
 */

const { createCoreService } = require('@strapi/strapi').factories;

const k8s = require('@kubernetes/client-node');
const axios = require('axios');
const https = require('https');
const YAML = require('yaml');

module.exports = createCoreService('api::kubernetes.kubernetes', {
    
      async getKubeConfig(clusterId) {
        const registry = await strapi.db.query("api::registry.registry").findOne({where: {id: clusterId}})
        if (!registry) throw new Error("Please set and select a registry");
    
        const kc = new k8s.KubeConfig();
        if (registry.config) {
          kc.loadFromString(registry.config);
        }
        return kc;
      },
    
      async getK8sItems(ctx) {
        const clusterId = ctx.request.headers.schema_id || '';
        const type = ctx.params.type;
        const kc = await this.getKubeConfig(
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
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, namespace: ctx.params.namespace}, limit: 99999, orderBy: {time: "ASC"}})
          } else if (type == "cronjob") {
            items = await k8sBatchApi.listNamespacedCronJob(
              ctx.params.namespace
            );
          } else if (type == "daemonset") {
            items = await k8sAppApi.listNamespacedDaemonSet(
              ctx.params.namespace
            );
            const names = items.body.items.map((i) => i.metadata.name + "-")
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: {$containsi: names}, namespace: ctx.params.namespace}, limit: 99999, orderBy: {time: "ASC"}})
          } else if (type == "deployment") {
            items = await k8sAppApi.listNamespacedDeployment(
              ctx.params.namespace
            );
            const names = items.body.items.map((i) => i.metadata.name + "-")
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: {$containsi: names}, namespace: ctx.params.namespace}, limit: 99999, orderBy: {time: "ASC"}})
          } else if (type == "job") {
            items = await k8sBatchApi.listNamespacedJob(
              ctx.params.namespace
            );
          } else if (type == "replicaset") {
            items = await k8sAppApi.listNamespacedReplicaSet(
              ctx.params.namespace
            );
            const names = items.body.items.map((i) => i.metadata.name + "-")
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: {$containsi: names}, namespace: ctx.params.namespace}, limit: 99999, orderBy: {time: "ASC"}})
          } else if (type == "replicationcontroller") {
            items = await k8sCoreApi.listNamespacedReplicationController(
              ctx.params.namespace
            );
          } else if (type == "statefulset") {
            items = await k8sAppApi.listNamespacedStatefulSet(
              ctx.params.namespace
            );
            const names = items.body.items.map((i) => i.metadata.name + "-")
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: {$containsi: names}, namespace: ctx.params.namespace}, limit: 99999, orderBy: {time: "ASC"}})
          } 
        } else {
          if (type == "pod") {
            items = await k8sCoreApi.listPodForAllNamespaces();
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId}, limit: 99999, orderBy: {time: "ASC"}})
          } else if (type == "cronjob") {
            items = await k8sBatchApi.listCronJobForAllNamespaces();
          } else if (type == "daemonset") {
            items = await k8sAppApi.listDaemonSetForAllNamespaces();
            const names = items.body.items.map((i) => i.metadata.name + "-")
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: {$containsi: names}}, limit: 99999, orderBy: {time: "ASC"}})
          } else if (type == "deployment") {
            items = await k8sAppApi.listDeploymentForAllNamespaces();
            const names = items.body.items.map((i) => i.metadata.name + "-")
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: {$containsi: names}}, limit: 99999, orderBy: {time: "ASC"}})
          } else if (type == "job") {
            items = await k8sBatchApi.listJobForAllNamespaces();
          } else if (type == "replicaset") {
            items = await k8sAppApi.listReplicaSetForAllNamespaces();
            const names = items.body.items.map((i) => i.metadata.name + "-")
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: {$containsi: names}}, limit: 99999, orderBy: {time: "ASC"}})
          } else if (type == "replicationcontroller") {
            items = await k8sCoreApi.listReplicationControllerForAllNamespaces();
          } else if (type == "statefulset") {
            items = await k8sAppApi.listStatefulSetForAllNamespaces();
            const names = items.body.items.map((i) => i.metadata.name + "-")
            metricsAll = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: {$containsi: names}}, limit: 99999, orderBy: {time: "ASC"}})
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
              const metrics = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: item.metadata.name, namespace: item.metadata.namespace}, limit: 99999, orderBy: {time: "ASC"}})
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
        } else {
          items.body.metrics = []
        }
    
        ctx.response.body = items.body;
      },
      async getK8sItem(ctx) {
        const clusterId = ctx.headers.schema_id || '';
        const type = ctx.params.type;
        const name = ctx.params.name;
        const namespace = ctx.params.namespace;
        const kc = await this.getKubeConfig(
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
            const metrics = await strapi.db.query("api::metric.metric").findMany({where: {registry: clusterId, name: item.body.metadata.name, namespace: item.body.metadata.namespace}, limit: 99999, orderBy: {time: "ASC"}})
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
    
        } catch {
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
            if (!job.metadata.labels["job-name"] || job.metadata.labels["job-name"].indexOf(item.metadata.name + "-") == -1) continue;
            if (job.status.conditions && job.status.conditions[0].type == "Complete") {
              await this.setPodInfo(kc, job, "job")
              notWorking.push(job)
            } if (job.status.conditions && job.status.conditions[0].type == "Running") {
              await this.setPodInfo(kc, job, "job")
              active.push(job)
            }
          }
          item.active = active;
          item.notWorking = notWorking;
        } else if (type == "daemonset") {
          podLabel = "app=" + item.metadata.name
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
          podLabel = "app=" + item.metadata.labels.app
          desired = item.spec.replicas
          item.podInfo = {desired: desired, succeeded: 0, running: item.status.availableReplicas ? item.status.availableReplicas : 0}
    
        } else if (type == "replicationcontroller") {
          podLabel = "app=" + item.metadata.labels.app
          desired = item.status.replicas
          item.podInfo = {desired: desired, succeeded: 0, running: item.status.availableReplicas ? item.status.availableReplicas : 0}
    
        } else if (type == "statefulset") {
          podLabel = "app=" + item.metadata.name
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
        const kc = await this.getKubeConfig(
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
    
      async getK8sLogs(ctx) {
        const name = ctx.params.name;
        const namespace = ctx.params.namespace;
        const container = ctx.params.container;
        let page = ctx.query.page;
        const pageSize = ctx.query.itemsPerPage || 100;
        const search = ctx.query.search;
        const clusterId = ctx.headers.schema_id || '';
        const kc = await this.getKubeConfig(
          clusterId,
          "k8s"
        );
        const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
        const logs = await k8sCoreApi.readNamespacedPodLog(name, namespace, container, false, true, undefined, undefined, undefined, undefined, 100000);
    
        let lines = logs.body.split("\n")
        
        if (search) {
          lines = lines.filter(((l) => l.indexOf(search) > -1))
        }
    
        const countPage = Math.ceil(lines.length / pageSize)
        if (!page) {
          page = countPage;
        }
    
        lines = lines.slice((page -1) * pageSize, page * pageSize)
    
        ctx.response.body = {countPage, logs: lines.join("\n")}
      },
      getK8sAxios(reg) {
        if (!reg?.address?.length) {
          throw new Error("The cluster is not registered.");
        }
    
        const json = YAML.parse(reg.config)
        const context = json.contexts.find((e) => e.name == json['current-context']);
        const cluster = json.clusters.find((e) => e.name == context.context.cluster);
        const user = json.users.find((e) => e.name == context.context.user);
    
        if (user?.user?.token) {
          return axios.create({
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            baseURL: cluster.cluster.server,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + user.user.token,
            },
          });
        } else {
          const cert = new Buffer.from(user.user["client-certificate-data"], "base64").toString() ;
          const key = new Buffer.from(user.user["client-key-data"], "base64").toString();
          
          return axios.create({
            httpsAgent: new https.Agent({ cert, key, rejectUnauthorized: false}),
            baseURL: cluster.cluster.server,
            headers: {
              "Content-Type": "application/json"
            },
          });
        }
    
      }
});
