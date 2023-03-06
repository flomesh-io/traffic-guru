'use strict';

/**
 * kubectl controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::kubectl.kubectl');
