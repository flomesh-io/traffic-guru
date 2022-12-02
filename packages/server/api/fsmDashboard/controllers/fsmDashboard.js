'use strict';

module.exports = {
  async getFsmDashboardPageInfo(ctx) {
    return await strapi.services.fsmdashboard.getFsmDashboardPageInfo(ctx);
  },
};
