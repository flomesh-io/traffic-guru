'use strict';

/**
 * ingress router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::ingress.ingress');
