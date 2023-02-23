'use strict';

/**
 * namespace service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::namespace.namespace',{
  async fetchK8sService(nsData, regData) {
    strapi.log.debug('======>> namespace.fetchK8sService: ns = ' + nsData.name);
    const k8sApi = await strapi.service('api::registry.registry').getK8sApi(regData.config);
    try {
      const result = await k8sApi.listNamespacedService(nsData.name);
      result.body.items.forEach(async (item) => {
        strapi.log.debug(`  ======>>>> fetch service[ ${item.metadata.name} ]: for namespace--[ ${nsData.name} ]`);
        strapi.entityService.create('api::service.service', {
          data: {
            name: item.metadata.name,
            namespace: nsData.name,
            ns: nsData.id,
            registry: regData.id,
            content: item,
            autoCreateApp: regData.content.autoApplication,
            autoCreateUpstream: regData.content.autoUpstream,
            uid: item.metadata.uid,
            selector: item.spec?.selector?.app
          }
        });
      });
    } catch (error) {
      strapi.log.error(error);
    }
  },
});
