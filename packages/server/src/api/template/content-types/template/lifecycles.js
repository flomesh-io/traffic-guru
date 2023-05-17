"use strict";

module.exports = {
  afterCreate: async (event) => {
    const { result } = event;
    if (result.name === 'default') return; //  模板文件不做操作
    const template = await strapi.db.query("api::template.template").findOne({
      select: ['type', 'path', 'name', 'content'],
      where: {
        type: result.type,
        name: 'default'
      },
      populate: {
        templatefiles: true
      }
    });
    const templatefiles = template.templatefiles
    const codebaseName = `/flomesh/bases/${result.type}/${result.name}`;
    templatefiles.map(
      ({ type, path, name, content }) => ({ type, path, name, content, template: result.id })
    ).forEach((file) => (
      strapi.db.query("api::templatefile.templatefile").create(
        {
          data: file
        }
      ))
    )
    await strapi.service('api::resource.resource').deployBaseRepo(
      codebaseName,
      Object.fromEntries(
        templatefiles.map(({ path, content }) => [path, content])
      ),
      result.version + 1
    );

  },
};  