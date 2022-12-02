'use strict';

const k8s = require('@kubernetes/client-node');

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
    const k8sConf = {
      server: data.address,
      certificate_authority_data: '',
      user: 'default',
      token: data.content.credit,
    };
    const k8sApi = await this.getK8sApi(k8sConf);
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
    strapi.log.info(
      '============>> service.registry.fetchK8sNamespace: reg-id = ' + regId
    );
    const k8sConf = await this.getK8sConfig(regId);
    const k8sApi = await this.getK8sApi(k8sConf);
    try {
      const result = await k8sApi.listNamespace();
      const namespaces = await strapi
        .query('namespace')
        .find({ registry: regId });
      result.body.items.forEach(async (item) => {
        strapi.log.info(
          '      ======>>>> fetch namespace: ' + item.metadata.name
        );
        if (!namespaces.find((n) => n.name == item.metadata.name)) {
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
      certificate_authority_data: '',
      user: 'default',
      token: registry.content.credit,
    };
  },

  async getK8sApi(conf) {
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
    return kc.makeApiClient(k8s.CoreV1Api);
  },
};
