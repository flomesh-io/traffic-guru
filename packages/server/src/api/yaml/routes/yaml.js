'use strict';

/**
 * yaml router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::yaml.yaml');
