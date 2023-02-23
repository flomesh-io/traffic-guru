"use strict";

module.exports = {
  afterCreate: async (result) => {
    if (result.name === 'default') return; //  模板文件不做操作
    const templatefiles = await strapi.db.query("api::templatefile.templatefile").findMany({
      select: ['type', 'path', 'name', 'content'],
      where: {
        type: result.result.type
      },
      populate: {
        template: {
          where: {
            name: "default"
          }
        }
      }
    });
    // const knex = strapi.db.connection;
    //   const templates = await strapi
    //     .query('templatefile')
    //     .model.query((qb) =>
    //       qb
    //         .innerJoin('templates', `templatefiles.template`, 'templates.id')
    //         .whereRaw(`templates.name = 'default' and templatefiles.type = ?`, [
    //           result.type,
    //         ])
    //     )
    //     .fetchAll({
    //       columns: [
    //         'templatefiles.type',
    //         'templatefiles.path',
    //         'templatefiles.name',
    //         'templatefiles.content',
    //       ],
    //     });
    //   const temp = templates.toJSON();
    //   temp.map((item) => Object.assign(item, { template: result.id }));

    const codebaseName = `/flomesh/bases/${result.type}/${result.name}`;
    templatefiles.map(
      ({ type, path, name, content }) => ({ type, path, name, content, template: result.result.id })
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
      result.result.version
    );

  },
};  