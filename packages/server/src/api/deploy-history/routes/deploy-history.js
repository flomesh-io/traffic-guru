'use strict';

/**
 * deploy-history router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::deploy-history.deploy-history');
