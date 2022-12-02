'use strict';

function flat2tree(pid, arr) {
  return arr
    .filter((item) => item.pid === pid)
    .map((item) => ({ ...item, children: flat2tree(item.id, arr) }));
}

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async getOrgsTree(ctx) {
    const orgs = await strapi.services.organization.find();
    for (let index = 0; index < orgs.length; index++) {
      if (orgs[index].parent == null) {
        orgs[index].pid = 0;
      } else {
        orgs[index].pid = orgs[index].parent.id;
      }
    }
    return flat2tree(0, orgs);
  },
  async myOrganizations(ctx) {
    const userId = ctx.state.user.id;
    const user = await strapi
      .query('user', 'users-permissions')
      .findOne({ id: userId });
    if (user.role.id != 1) {
      const orgRole = await strapi
        .query('user-organization-role')
        .find({ type: 'organization', user: userId });
      const ids = orgRole.map((item) => item['organization'].id);
      if (orgRole.length == 0) {
        ctx.query.id_in = [-1];
      } else {
        ctx.query['id_in'] = ids;
      }
    }

    const values = await strapi.query('organization').find(ctx.query);

    return values;
  },
};
