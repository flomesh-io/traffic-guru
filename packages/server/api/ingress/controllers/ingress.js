'use strict';

module.exports = {
  async getIngresses(ctx) {
    return await strapi.services.ingress.getIngresses(ctx);
  },

  async getIngress(ctx) {
    await strapi.services.ingress.fetchIngresses(ctx, ctx.query.id);
    return await strapi.services.ingress.findOne(ctx.query);
  },

  async fetchIngresses(ctx) {
    return await strapi.services.ingress.fetchIngresses(ctx);
  },

  async updateIngressSync(ctx) {
    return await strapi.services.ingress.updateIngressSync(ctx);
  },

  async createIngressSync(ctx) {
    return await strapi.services.ingress.createIngressSync(ctx);
  },

  async deleteIngressSync(ctx) {
    return await strapi.services.ingress.deleteIngressSync(ctx);
  },
};
