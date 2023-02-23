'use strict';

module.exports = {
  async afterUpdate(event)  {
    const data = await strapi.db.query("api::service-import.service-import").findOne({where: event.params.where, populate: true})
    if(data.policySwitch) {
      await strapi.service("api::service-import.service-import").deleteGlobalTrafficPolicy(data);
      await strapi.service("api::service-import.service-import").createGlobalTrafficPolicy(data);
    } else {
      await strapi.service("api::service-import.service-import").deleteGlobalTrafficPolicy(data);
    }
  },

  async afterDelete(event) {
    if(!event.params.where.id){
      return;
    }
    const data = await strapi.db.query("api::service-import.service-import").findOne({where: {id: event.params.where.id}, populate: true})
    if(data?.policySwitch) {
      await strapi.service("api::service-import.service-import").deleteGlobalTrafficPolicy(data);
    }
  }
};
