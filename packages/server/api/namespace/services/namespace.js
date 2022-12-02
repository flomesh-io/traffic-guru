'use strict';

module.exports = {
  async fetchK8sService(nsData) {
    strapi.log.info(
      '============>> service.namespace.fetchK8sService: ns = ' + nsData.name
    );
    const k8sConf = {
      server: nsData.registry.address,
      certificate_authority_data: '',
      user: 'default',
      token: nsData.registry.content.credit,
    };
    const k8sApi = await strapi.services.registry.getK8sApi(k8sConf);
    try {
      const result = await k8sApi.listNamespacedService(nsData.name);
      result.body.items.forEach(async (item) => {
        strapi.log.info(
          `      ======>>>> fetch service[ ${item.metadata.name} ]: for namespace--[ ${nsData.name} ]`
        );
        strapi.services.service.create({
          name: item.metadata.name,
          namespace: nsData.name,
          ns: nsData.id,
          registry: nsData.registry.id,
          content: item,
          autoCreateApp: nsData.registry.content.autoApplication,
          autoCreateUpstream: nsData.registry.content.autoUpstream,
          uid: item.metadata.uid,
        });
      });
    } catch (error) {
      strapi.log.error(error);
    }
  },
};
