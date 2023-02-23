'use strict';

/**
 * prometheus controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::prometheus.prometheus', {
  async proxy(ctx) {
    await strapi.service("api::prometheus.prometheus").proxy(ctx);
  },
  async proxymesh(ctx) {
    await strapi.service("api::prometheus.prometheus").proxymesh(ctx);
  },
  async proxynamespace(ctx) {
    await strapi.service("api::prometheus.prometheus").proxynamespace(ctx);
  },
});
