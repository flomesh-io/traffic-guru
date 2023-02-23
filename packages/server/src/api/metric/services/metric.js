'use strict';

/**
 * metric service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::metric.metric');
