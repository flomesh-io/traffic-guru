'use strict';

module.exports = {
  async getUser(ctx) {
    let userId = ctx.query.id;
    if (!userId) {
      userId = ctx.state.user.id;
    }

    return await strapi.plugins['users-permissions'].services.user.fetch({
      id: userId,
    });
  },
};
