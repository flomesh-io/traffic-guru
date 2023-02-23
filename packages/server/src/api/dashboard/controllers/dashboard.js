'use strict';

/**
 * dashboard controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::dashboard.dashboard');
