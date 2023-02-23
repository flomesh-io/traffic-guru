"use strict";

module.exports = {
  async beforeCreate() {
    const ch = await strapi.db
      .query('api::fleet.fleet')
      .findOne({where: { type: 'clickhouse', apply: true }});
    if (!ch) {
      throw new Error('Please add clickhouse to the component first');
    }
  },
  async afterCreate(event) {
    const result = await strapi.query("api::mesh.mesh").findOne({where: {id: event.result.id}, populate: true})
    await strapi.service("api::mesh.mesh").osmInstall(result);
  },
  async afterUpdate(event) {
    try {
      await strapi.service("api::mesh.mesh").osmUpdate(event);
    } catch (error) {
      strapi.log.info(error?.body?.message);
    }
  },
   async afterFindMany(event) {
    for (const result of event.result) {
      try {
        await strapi.service("api::mesh.mesh").setMesh(result);
      } catch (error) {
        strapi.log.info(error?.body?.message);
      }
    }
  }, 
  async afterFindOne(event) {
    try {
      await strapi.service("api::mesh.mesh").setMeshBody(event.result);
    } catch (error) {
      //throw new Error('The OSM installation is not complete or failed');
    }
  },
  async beforeDelete(event) {
    try {
      if (event?.params?.where?.id) {
        await strapi.service("api::mesh.mesh").deleteMesh(event?.params?.where?.id);
      }
    } catch {
    }
  },
};  