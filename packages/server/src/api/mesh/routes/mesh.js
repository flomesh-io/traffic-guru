'use strict';

/**
 * mesh router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::mesh.mesh');
