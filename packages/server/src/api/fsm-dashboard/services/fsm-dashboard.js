'use strict';

/**
 * fsm-dashboard service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::fsm-dashboard.fsm-dashboard', {
    async getFsmDashboardPageInfo() {
        const services_summary = await strapi.db.query('api::service.service').count();
        let services_sidecar_summary = 3;
        let services_no_sidecar_summary = services_summary - 3;
        if (services_summary == 0) {
          services_sidecar_summary = 0;
          services_no_sidecar_summary = services_summary - 0;
        }
    
        const registries_summary = await strapi.db.query('api::registry.registry').count();
        let registries_valid_summary = registries_summary - 1;
        let registries_invalid_summary = 1;
        if (registries_summary == 0) {
          registries_valid_summary = 0;
          registries_invalid_summary = 0;
        }
        const obj = {
          services: {
            total: services_summary,
            include: services_sidecar_summary,
            exclude: services_no_sidecar_summary,
          },
    
          registries: {
            total: registries_summary,
            valid: registries_valid_summary,
            invalid: registries_invalid_summary,
          },
        };
        return obj;
      },
});
