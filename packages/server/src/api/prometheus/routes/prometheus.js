'use strict';

/**
 * prometheus router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::prometheus.prometheus');
