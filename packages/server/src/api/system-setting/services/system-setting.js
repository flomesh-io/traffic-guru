'use strict';

/**
 * system-setting service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::system-setting.system-setting');
