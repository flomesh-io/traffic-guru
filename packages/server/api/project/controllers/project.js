'use strict';

module.exports = {
  async myProjects(ctx) {
    const { _search, _limit, _start } = ctx.query;
    const user = ctx.state.user;
    const offset = _start ? _start * _limit : 0;
    const knex = strapi.connections.default;
    if (user.role.type == 'authenticated') {
      const query = {
        _limit,
        _start: offset,
        name_contains: _search || '',
      };
      const values = await strapi.query('project').find(query);
      const count = await strapi.query('project').count(query);
      return {
        values: values,
        aggregate: { count: values.length, totalCount: count },
      };
    } else {
      const values = await knex(
        'projects_users__users_user_projects as userPro'
      )
        .leftJoin('projects as pro', 'pro.id', '=', 'userPro.project_id')
        .where('userPro.user_id', user.id)
        .where('pro.name', 'like', `%${_search || ''}%`)
        .offset(offset)
        .limit(_limit);
      const total = await knex('projects_users__users_user_projects as userPro')
        .count('userPro.id as count')
        .leftJoin('projects as pro', 'pro.id', '=', 'userPro.project_id')
        .where('userPro.user_id', user.id)
        .where('pro.name', 'like', `%${_search || ''}%`);
      return {
        values: values,
        aggregate: { count: values.length, totalCount: total[0].count },
      };
    }
  },
};
