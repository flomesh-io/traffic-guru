'use strict';

module.exports = {
  lifecycles: {
    afterCreate: (result, data) => {
      if (data.regType == 'k8s') {
        strapi.log.info('fetch k8s service');
        strapi.services.namespace.fetchK8sService(result);
      }
    },
  },
};
