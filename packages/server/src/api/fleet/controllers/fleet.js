"use strict";

/**
 * fleet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::fleet.fleet", ({ strapi }) => ({
  async updatePipy(ctx) {
    strapi.log.info('===============>>>>>> forcePush:', ctx.request.body.id);
    const pipy = await strapi
      .query('fleet')
      .findOne({ id: ctx.request.body.id });
    await strapi.services.resource.deleteFleetRepo(pipy);
    return true;
  },
}));
