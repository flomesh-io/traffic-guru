'use strict';

/**
 * kubectl service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::kubectl.kubectl');
