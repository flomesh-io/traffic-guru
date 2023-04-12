'use strict';

/**
 * deploy-history service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::deploy-history.deploy-history');
