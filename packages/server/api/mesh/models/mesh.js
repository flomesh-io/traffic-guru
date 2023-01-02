'use strict';

module.exports = {
  lifecycles: {
    async beforeCreate() {
      const ch = await strapi
        .query('fleet')
        .findOne({ type: 'clickhouse', apply: true });
      if (!ch) {
        throw new Error('Please add clickhouse to the component first');
      }
    },
    async afterCreate(result) {
      await strapi.services.mesh.osmInstall(result);
    },
    async afterUpdate(result) {
      try {
        await strapi.services.mesh.osmUpdate(result);
      } catch (error) {
        strapi.log.info(error?.body?.message);
      }
    },
    async afterFind(results) {
      for (const result of results) {
        try {
          await strapi.services.mesh.setMesh(result);
        } catch (error) {
          result.status = {
            bootstrap: 'stop',
            controller: 'stop',
            injector: 'stop',
            mcs: 'stop'
          };
          strapi.log.info(error?.body?.message);
        }
      }
    },
    async afterFindOne(result) {
      try {
        await strapi.services.mesh.setMesh(result);
      } catch (error) {
        strapi.log.info(error?.body?.message);
      }
    },
    async afterDelete(result) {
      try {
        await strapi.services.mesh.deleteMesh(result);
      } catch (error) {
        strapi.log.error(error);
      }
    },
  },
};
