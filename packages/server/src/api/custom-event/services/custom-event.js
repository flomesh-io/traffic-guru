'use strict';

/**
 * custom-event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::custom-event.custom-event');
