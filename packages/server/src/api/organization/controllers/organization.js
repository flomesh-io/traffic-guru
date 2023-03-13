'use strict';

/**
 * organization controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

function flat2tree(pid, arr) {
    return arr
      .filter((item) => item.pid === pid)
      .map((item) => ({ ...item, children: flat2tree(item.id, arr) }));
  }

module.exports = createCoreController('api::organization.organization',{
  // eslint-disable-next-line no-unused-vars
  async getOrgsTree(args, ctx) {
    const orgs = await strapi.db.query("api::organization.organization").findMany({populate: true});
    for (let index = 0; index < orgs.length; index++) {
      if (orgs[index].parent == null) {
        orgs[index].pid = 0;
      } else {
        orgs[index].pid = orgs[index].parent.id;
      }
    }
    return flat2tree(0, orgs);
  },
  async myOrganizations(args, ctx) {
    if (ctx.state.user.role.id != 1) {
      const organizations = await strapi.db
        .query('api::organization.organization')
        .findMany({
          where: { users: ctx.state.user.id },
          populate: true,
        });
      const ids = organizations.map((item) => item.id);
      if (!args.filters) args.filters = {}
      args.filters.id = {$in: ids}
    }
    const values = await strapi.entityService.findMany('api::organization.organization',args);
    return values;
  },
});
