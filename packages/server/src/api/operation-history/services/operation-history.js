'use strict';

/**
 * operation-history service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::operation-history.operation-history');
