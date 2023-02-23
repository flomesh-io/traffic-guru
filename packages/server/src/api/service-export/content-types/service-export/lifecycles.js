'use strict';

module.exports = {
  async beforeCreate(event) {
    const data = event.params.data;
    const svc = await strapi.db.query('api::service.service').findOne({
      where: {
        id: data.service,
      },
      populate: true,
    });
    data.clusterKey = 'default/default/default/cluster' + svc.registry.id;
    const svcExportData = {
      apiVersion: 'flomesh.io/v1alpha1',
      kind: 'ServiceExport',
      metadata: {
        namespace: svc.namespace,
        name: svc.name,
      },
      spec: {
        rules: [
          {
            portNumber: data.content.portNumber,
            path: data.content.path,
            pathType: 'Prefix',
          },
        ],
      },
    };
    // create service exports in k8s
    const k8sAxios = await strapi
      .service('api::kubernetes.kubernetes')
      .getK8sAxios(svc.registry);
    const svcExportsUrl =
      '/apis/flomesh.io/v1alpha1/namespaces/' +
      svc.namespace +
      '/serviceexports';
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
    const regs = await strapi.db.query('api::registry.registry').findMany();
    for (let index = 0; index < regs.length; index++) {
      if (regs[index].type === 'k8s') {
        // sync service imports from k8s
        await strapi
          .service('api::service-import.service-import')
          .syncCreateSvcImports(regs[index]);
      }
    }
  },

  async afterUpdate(event) {
    const data = event.params.data;
    const svc = await strapi.db.query('api::service.service').findOne({
      where: {
        id: data.service,
      },
      populate: true,
    });
    const svcExportData = {
      apiVersion: 'flomesh.io/v1alpha1',
      kind: 'ServiceExport',
      metadata: {
        namespace: svc.namespace,
        name: svc.name,
      },
      spec: {
        rules: [
          {
            portNumber: data.content.portNumber,
            path: data.content.path,
            pathType: 'Prefix',
          },
        ],
      },
    };
    // update service exports in k8s
    const k8sAxios = await strapi
      .service('api::kubernetes.kubernetes')
      .getK8sAxios(svc.registry);
    const svcExportsUrl =
      '/apis/flomesh.io/v1alpha1/namespaces/' +
      svc.namespace +
      '/serviceexports/' +
      svc.name;
    await k8sAxios
      .get(svcExportsUrl)
      .then(function (response) {
        // get resourceVersion for update
        svcExportData.metadata.resourceVersion =
          response.data.metadata.resourceVersion;
        k8sAxios.put(svcExportsUrl, svcExportData).catch(function (error) {
          strapi.log.error(error);
          throw new Error('ErieCanal ' + error);
        });
      })
      .catch(function (error) {
        strapi.log.error(error);
        throw new Error('ErieCanal ' + error);
      });
  },

  async beforeDelete(event) {
    const serviceImport = await strapi.db
      .query('api::service-import.service-import')
      .findOne({
        where: {
          serviceExports: { id: event.params.where.id },
        },
        populate: true,
      });
    if (!serviceImport) {
      return;
    }
    const svc = await strapi.db.query('api::service.service').findOne({
      where: {
        serviceExport: { id: serviceImport.serviceExports.map((s) => s.id) },
      },
      populate: true,
    });
    if (!svc) {
      return;
    }
    // delete service exports in k8s
    const k8sAxios = await strapi
      .service('api::kubernetes.kubernetes')
      .getK8sAxios(svc.registry);
    const svcExportUrl =
      '/apis/flomesh.io/v1alpha1/namespaces/' +
      svc.namespace +
      '/serviceexports/' +
      svc.name;
    await k8sAxios.delete(svcExportUrl).catch(function (error) {
      strapi.log.error(error);
    });
  },
  async afterDelete(event) {
    if (!event.params.where.id) {
      return;
    }
    // get all registries
    const regs = await strapi.db
      .query('api::registry.registry')
      .findMany({ populate: true });
    for (let index = 0; index < regs.length; index++) {
      if (regs[index].type === 'k8s') {
        // sync service imports from k8s
        await strapi
          .service('api::service-import.service-import')
          .syncDeleteSvcImports(regs[index]);
      }
    }
  },
};
