"use strict";

module.exports = {
  beforeCreate: async (event) => {
    if (!event.params.data.version) {
      event.params.data.version = -1
    }
  },
  beforeUpdate: async (event) => {
    if (!event.params.data.version) {
      const svc = await strapi.db.query("api::service.service").findOne(event.params)
      event.params.data.version = Number(svc.version) + 1
    }
  },
  afterCreate: async (event) => {
    const { result } = event;
    // strapi.log.debug('  ------> service::afterCreate - result = ' + JSON.stringify(result));
    //const svcName = result.name;
    const svcId = result.id;
    // if (result.autoCreateUpstream) {
    //   strapi.log.debug('      ======>>>>>> Auto create upstream ' + svcName);
    //   // const ups = await strapi.services.upstream.create({
    //   //   name: svcName,
    //   //   content: {
    //   //     targets: [],
    //   //     displayName: svcName,
    //   //   },
    //   // });
    //   const ups = await strapi.entityService.create('api::upstream.upstream', {
    //     data: {
    //       name: svcName,
    //       content: {
    //         targets: [],
    //         displayName: svcName,
    //       }
    //     }
    //   });
    //   // link the service to the upstream
    //   // strapi.query('service').update({ id: svcId }, { upstream: ups.id });
    //   await strapi.entityService.update('api::service.service', svcId, {
    //     data: {
    //       upstream: ups.id,
    //     },
    //   });
    // }

    // if (result.autoCreateApp) {
    //   strapi.log.info('      ==========>>>>>> Auto create appication ' + svcName);
    //   // await strapi.services.application.create({
    //   //   name: svcName,
    //   //   content: {
    //   //     apis: [],
    //   //     identitys: {},
    //   //     identifiers: {},
    //   //     certificates: [],
    //   //   },
    //   //   service: svcId,
    //   // });
    //   await strapi.entityService.create('api::application.application', {
    //     data: {
    //       name: svcName,
    //       content: {
    //         apis: [],
    //         identitys: {},
    //         identifiers: {},
    //         certificates: [],
    //       },
    //       service: svcId,
    //     }
    //   });
    // }

    try {
      // await strapi.services.service.deploySidecar(data.id);
      const service = await strapi.db.query('api::service.service').findOne({
        where: {
          id: svcId
        },
        populate: {
          sidecar: {
            populate: true
          },
          organization: true,
          registry: true,
          applications: true,
          whitelistServices: {
            populate: true
          },
          blacklistServices: {
            populate: true
          },
          whitelistServicesBack: {
            populate: true
          },
          blacklistServicesback: {
            populate: true
          },
          subscribeOrgs: true
        }
      })
      if (!result.organization || result.organization.count === 0) return;
      await strapi.service('api::service.service').deployService(service);
      // await strapi.service('api::service.service').deploySidecar(svcId);
    } catch (error) {
      console.error(error);
    }
  },
};  