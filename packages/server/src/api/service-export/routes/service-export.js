'use strict';

/**
 * service-export router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::service-export.service-export');
