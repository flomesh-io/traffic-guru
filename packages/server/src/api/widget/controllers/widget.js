'use strict';

/**
 * widget controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::widget.widget',{
    async getWidgets(ctx) {
    const userId = ctx.state.user.id;
    if (!userId) {
      return;
    }
    return await strapi.services.widget.find({ user_id: userId });
  },
});
