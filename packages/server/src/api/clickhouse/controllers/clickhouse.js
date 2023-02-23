'use strict';

/**
 * clickhouse controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::clickhouse.clickhouse', {
    async proxy(ctx) {
        await strapi.service("api::clickhouse.clickhouse").proxy(ctx);
      },
});
