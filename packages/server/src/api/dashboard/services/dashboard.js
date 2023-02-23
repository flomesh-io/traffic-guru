'use strict';

/**
 * dashboard service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dashboard.dashboard');
