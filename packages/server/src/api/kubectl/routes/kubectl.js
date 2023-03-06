'use strict';

/**
 * kubectl router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::kubectl.kubectl');
