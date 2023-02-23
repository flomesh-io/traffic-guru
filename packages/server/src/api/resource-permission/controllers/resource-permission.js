'use strict';

/**
 * resource-permission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::resource-permission.resource-permission',{
    
      async createRoleResourcePermission(ctx) {
        return await strapi.services[
          'resource-permission'
        ].createRoleResourcePermission(ctx);
      },
      async updateRoleResourcePermission(ctx) {
        return await strapi.services[
          'resource-permission'
        ].updateRoleResourcePermission(ctx);
      }
});
