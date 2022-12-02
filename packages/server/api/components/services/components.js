'use strict';

module.exports = {
  async getComponents(ctx) {
    const name = ctx.query.name || '';
    const type = ctx.query.type || null;
    const id = ctx.query.id || '';
    const start = ctx.query._start || '';
    const limit = ctx.query._limit || '';
    let sort = ctx.query._sort || '';

    if (sort) {
      sort = [{ column: sort }];
    } else {
      sort = [{ column: 'type' }, { column: 'name' }];
    }

    const knex = strapi.connections[strapi.config.database.defaultConnection];
    const result = await knex('components')
      .where('name', 'like', '%' + name + '%')
      .andWhere(function () {
        if (type) {
          this.whereIn('type', type);
        }
      })
      .andWhere(function () {
        if (id) {
          this.andWhere('target_id', id);
        }
      })
      .orderBy(sort)
      .limit(limit)
      .offset(start);
    const count = await knex('components')
      .where('name', 'like', '%' + name + '%')
      .andWhere(function () {
        if (type) {
          this.whereIn('type', type);
        }
      })
      .andWhere(function () {
        if (id) {
          this.andWhere('target_id', id);
        }
      })
      .count({ count: 'target_id' });
    return { aggregate: { totalCount: count[0].count }, values: result };
  },
};
