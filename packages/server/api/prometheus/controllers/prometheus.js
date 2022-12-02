'use strict';

module.exports = {
  async proxy(ctx) {
    await strapi.services.prometheus.proxy(ctx);
  },
  async proxymesh(ctx) {
    await strapi.services.prometheus.proxymesh(ctx);
  },
  async proxynamespace(ctx) {
    await strapi.services.prometheus.proxynamespace(ctx);
  },
};
