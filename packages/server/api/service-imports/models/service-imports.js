'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterUpdate(result)  {
      if(result.policySwitch) {
        await strapi.services['service-imports'].deleteGlobalTrafficPolicy(result);
        await strapi.services['service-imports'].createGlobalTrafficPolicy(result);
      } else {
        await strapi.services['service-imports'].deleteGlobalTrafficPolicy(result);
      }
    },

    async afterDelete(result) {
      if(!result){
        return;
      }
      if(result?.policySwitch) {
        await strapi.services['service-imports'].deleteGlobalTrafficPolicy(result);
      }
    }
  }
};
