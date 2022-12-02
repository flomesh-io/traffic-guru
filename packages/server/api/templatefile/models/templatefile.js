'use strict';

module.exports = {
  lifecycles: {
    afterCreate: async (result) => {
      const template = result.template;
      const path = `/flomesh/bases/${template.type}/${template.name}`;
      await strapi
        .query('template')
        .update({ id: template.id }, { version: template.version + 1 });
      strapi.services.resource.deployBaseRepo(
        path,
        Object.fromEntries([[result.path, result.content]]),
        template.version + 1
      );
    },
    afterUpdate: async (result) => {
      const template = result.template;
      const path = `/flomesh/bases/${template.type}/${template.name}`;
      await strapi
        .query('template')
        .update({ id: template.id }, { version: template.version + 1 });
      strapi.services.resource.deployBaseRepo(
        path,
        Object.fromEntries([[result.path, result.content]]),
        template.version + 1
      );
    },
  },
};
