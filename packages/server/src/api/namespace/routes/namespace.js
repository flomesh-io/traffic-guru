'use strict';

/**
 * namespace router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::namespace.namespace');
