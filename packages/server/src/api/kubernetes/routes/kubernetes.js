'use strict';

/**
 * kubernetes router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::kubernetes.kubernetes');
