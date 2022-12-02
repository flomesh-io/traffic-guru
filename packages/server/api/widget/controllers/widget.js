'use strict';

module.exports = {
  async getWidgets(ctx) {
    const userId = ctx.state.user.id;
    if (!userId) {
      return;
    }
    return await strapi.services.widget.find({ user_id: userId });
  },
};
