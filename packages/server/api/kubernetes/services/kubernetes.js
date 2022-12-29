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

    const kc = new k8s.KubeConfig();
    kc.loadFromOptions({
      clusters: [cluster],
      users: [user],
      contexts: [context],
      currentContext: context.name,
    });
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
};
