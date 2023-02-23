'use strict';

/**
 * dashboard router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::dashboard.dashboard');
