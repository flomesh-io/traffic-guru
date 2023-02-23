'use strict';

/**
 * uni-component service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::uni-component.uni-component', {
    async getComponents(args) {
        const name = args.filters.name || '';
        const type = args.filters.type || null;
        const id = args.filters.id || '';
        const start = args.start || '';
        const limit = args.limit || '';
        let sort = args.sort || '';
    
        if (!sort.length) {
          sort = [{ column: 'type' }, { column: 'name' }];
        }
    
        const knex = strapi.db.connection;
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
        return { meta: {pagination: { total: count[0].count }}, data: result };
      },
});
