'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const svc = await strapi.query('service').findOne({
        id: data.service
      });
      data.clusterKey = "default/default/default/cluster" + svc.registry.id;
      const svcExportData = {
        apiVersion: 'flomesh.io/v1alpha1',
        kind: 'ServiceExport',
        metadata: {
          namespace: svc.namespace,
          name: svc.name,
        },
        spec: {
          rules: [{
            portNumber: data.content.portNumber,
            path: data.content.path,
            pathType: 'Prefix',
          }],
        }
      };
      // create service exports in k8s
      const k8sAxios = strapi.config.functions.kubeUtils.getK8sAxios(svc.registry);
      const svcExportsUrl = '/apis/flomesh.io/v1alpha1/namespaces/' + svc.namespace + '/serviceexports';
      await k8sAxios.post(svcExportsUrl, svcExportData).catch(function (error) {
        if (error.response.status === 409) {
          strapi.log.info('Exported already!');
        } else {
          strapi.log.error(error);
          throw new Error('ErieCanal ' + error);
        }
      });
    },
    async afterCreate() {
      // get all registries
      const regs = await strapi.query('registry').find();
      for (let index = 0; index < regs.length; index++) {
        if (regs[index].type === 'k8s') {
          // sync service imports from k8s
          await strapi.services['service-imports'].syncCreateSvcImports(regs[index]);
        }
      }
    },
    async afterUpdate() {
      // get all registries
      const regs = await strapi.query('registry').find();
      for (let index = 0; index < regs.length; index++) {
        if (regs[index].type === 'k8s') {
          // sync service imports from k8s
          await strapi.services['service-imports'].syncCreateSvcImports(regs[index]);
        }
      }
    },

    async afterUpdate() {
      /////////////
      //TODO:: 更新k8s svc-exports
      /////////////
    },

    async beforeDelete(params) {
      const svc = await strapi.query('service').findOne({
        serviceExport: params.id
      });
      if(!svc){
        return;
      }
      // delete service exports in k8s
      const k8sAxios = strapi.config.functions.kubeUtils.getK8sAxios(svc.registry);
      const svcExportUrl = '/apis/flomesh.io/v1alpha1/namespaces/' + svc.namespace + '/serviceexports/' + svc.name;
      await k8sAxios.delete(svcExportUrl).catch(function (error) {
        strapi.log.error(error);
      });
    },
    async afterDelete(result) {
      if(!result) {
        return;
      }
      // get all registries
      const regs = await strapi.query('registry').find();
      for (let index = 0; index < regs.length; index++) {
        if (regs[index].type === 'k8s') {
          // sync service imports from k8s
          await strapi.services['service-imports'].syncDeleteSvcImports(regs[index]);
        }
      }
    },

  },
};
