'use strict';

/**
 * metric router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::metric.metric');
