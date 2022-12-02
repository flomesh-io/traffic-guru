'use strict';

module.exports = {
  async getRolesConnection(ctx) {
    strapi.log.info(ctx.query);
    const type = ctx.query.type;
    const _limit = ctx.query._limit;
    const start = ctx.query.start;
    const sort = [{ column: ctx.query.sort ? ctx.query.sort : 'id' }];

    const knex = strapi.connections[strapi.config.database.defaultConnection];

    const result = await knex('users-permissions_role')
      .where(1, '=', 1)
      .andWhere(function () {
        if (type) {
          this.where('type', type);
        }
      })
      .orderBy(sort)
      .limit(_limit)
      .offset(start);

    const count = await knex('users-permissions_role')
      .where(1, '=', 1)
      .andWhere(function () {
        if (type) {
          this.where('type', type);
        }
      })
      .count({ count: 'id' });
    return { aggregate: { totalCount: count[0].count }, values: result };
  },
};
