'use strict';

module.exports = {
  lifecycles: {
    afterCreate: async (result) => {
      const knex = strapi.connections[strapi.config.database.defaultConnection];
      const templates = await strapi
        .query('templatefile')
        .model.query((qb) =>
          qb
            .innerJoin('templates', `templatefiles.template`, 'templates.id')
            .whereRaw(`templates.name = 'default' and templatefiles.type = ?`, [
              result.type,
            ])
        )
        .fetchAll({
          columns: [
            'templatefiles.type',
            'templatefiles.path',
            'templatefiles.name',
            'templatefiles.content',
          ],
        });
      const temp = templates.toJSON();
      temp.map((item) => Object.assign(item, { template: result.id }));

      const codebaseName = `/flomesh/bases/${result.type}/${result.name}`;

      knex
        .batchInsert('templatefiles', temp)
        .then(async function () {
          await strapi.services.resource.deployBaseRepo(
            codebaseName,
            Object.fromEntries(
              temp.map(({ path, content }) => [path, content])
            ),
            result.version
          );
        })
        .catch(function (error) {
          strapi.log.error(error);
        });
    },
  },
};
