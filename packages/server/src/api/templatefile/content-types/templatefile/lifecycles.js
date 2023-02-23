"use strict";

module.exports = {
  // eslint-disable-next-line no-unused-vars
  afterCreate: async (event) => {
    // const { result, params } = event;
    // const templateFile = await strapi.db.query('api::templatefile.templatefile').findOne({
    //   where: { id: result.id },
    //   populate: {
    //     template: true
    //   }
    // });
    // const template = templateFile.template;
    // if (!template) return;
    // const path = `/flomesh/bases/${template.type}/${template.name}`;
    // await strapi.db.query('api::template.template').update({
    //   where: { id: template.id },
    //   data: {
    //     version: template.version + 1,
    //   },
    // });
    // strapi.service('api::resource.resource').deployBaseRepo(
    //   path,
    //   Object.fromEntries([[result.path, result.content]]),
    //   template.version + 1
    // );
  },
  afterUpdate: async (event) => {
    const { result } = event;
    const templateFile = await strapi.db.query('api::templatefile.templatefile').findOne({
      where: { id: result.id },
      populate: {
        template: true
      }
    });
    const template = await strapi.db.query('api::template.template').update({
      where: { id: templateFile.template.id },
      data: {
        version: templateFile.template.version + 1,
      }
    });
    const path = `/flomesh/bases/${template.type}/${template.name}`;
    await strapi.db.query('api::template.template').update({
      where: { id: template.id },
      data: {
        version: template.version + 1,
      },
    });
    strapi.service('api::resource.resource').deployBaseRepo(
      path,
      Object.fromEntries([[result.path, result.content]]),
      template.version + 1
    );
  },
};  