'use strict';

/**
 * widget service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::widget.widget');
