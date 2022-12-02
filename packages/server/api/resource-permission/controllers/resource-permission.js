'use strict';

module.exports = {
  async getResourcePermission(ctx) {
    return await strapi.services['resource-permission'].getResourcePermission(
      ctx
    );
  },
  async createRoleResourcePermission(ctx) {
    return await strapi.services[
      'resource-permission'
    ].createRoleResourcePermission(ctx);
  },
  async updateRoleResourcePermission(ctx) {
    return await strapi.services[
      'resource-permission'
    ].updateRoleResourcePermission(ctx);
  },
  async deleteRoleResourcePermission(ctx) {
    return await strapi.services[
      'resource-permission'
    ].deleteRoleResourcePermission(ctx);
  },
};
