'use strict';

/**
 * service-export service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service-export.service-export');
