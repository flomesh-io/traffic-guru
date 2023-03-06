'use strict';

/**
 * yaml service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::yaml.yaml');
