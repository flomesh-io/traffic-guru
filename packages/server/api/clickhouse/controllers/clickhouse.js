'use strict';

module.exports = {
  async proxy(ctx) {
    await strapi.services.clickhouse.proxy(ctx);
  },
};
