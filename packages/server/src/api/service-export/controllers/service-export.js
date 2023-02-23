'use strict';

/**
 * service-export controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::service-export.service-export');
