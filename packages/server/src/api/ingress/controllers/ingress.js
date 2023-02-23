'use strict';

/**
 * ingress controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ingress.ingress',{
    async getIngresses(args, ctx) {
        return await strapi.service("api::ingress.ingress").getIngresses(args, ctx);
      },
    
      async getIngress(args, ctx) {
        await strapi.service("api::ingress.ingress").fetchIngresses(args, ctx, args.id);
        return await strapi.service("api::ingress.ingress").findOne(ctx.query);
      },
    
      async fetchIngresses(args, ctx) {
        return await strapi.service("api::ingress.ingress").fetchIngresses(args, ctx);
      },
    
      async updateIngressSync(ctx) {
        return await strapi.service("api::ingress.ingress").updateIngressSync(ctx);
      },
    
      async createIngressSync(ctx) {
        return await strapi.service("api::ingress.ingress").createIngressSync(ctx);
      },
    
      async deleteIngressSync(ctx) {
        return await strapi.service("api::ingress.ingress").deleteIngressSync(ctx);
      },
});
