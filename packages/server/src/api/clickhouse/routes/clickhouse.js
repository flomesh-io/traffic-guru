'use strict';

/**
 * clickhouse router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::clickhouse.clickhouse');
