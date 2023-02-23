'use strict';

/**
 * sql-escape-rule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sql-escape-rule.sql-escape-rule');
