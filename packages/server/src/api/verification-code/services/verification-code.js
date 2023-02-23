'use strict';

/**
 * verification-code service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::verification-code.verification-code');
