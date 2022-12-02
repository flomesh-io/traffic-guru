'use strict';

module.exports = {
  async getComponents(ctx) {
    return await strapi.services.components.getComponents(ctx);
  },
};
