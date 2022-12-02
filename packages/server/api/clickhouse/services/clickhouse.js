'use strict';

const axios = require('axios');
const querystring = require('querystring');

module.exports = {
  async proxy(ctx) {
    const fleet = await strapi.query('fleet').find({ type: 'clickhouse' });
    if (fleet == null || fleet.length == 0) {
      return;
    }

    const config = fleet[0].content;
    const method = ctx.request.method;

    let sqlEscapeRules = await strapi
      .query('sql-escape-rule')
      .find({ type_null: true });
    let queryStr = ctx.query.query;
    const type = ctx.query.type;
    const target_id = ctx.query.id;
    for (const sqlEscapeRule of sqlEscapeRules) {
      const reg = new RegExp('\\b' + sqlEscapeRule.find + '\\b', 'gi');
      queryStr = queryStr.replace(reg, sqlEscapeRule.replace);
    }

    if (type && target_id) {
      sqlEscapeRules = await strapi
        .query('sql-escape-rule')
        .find({ type, target_id });
      for (const sqlEscapeRule of sqlEscapeRules) {
        const reg = new RegExp('\\b' + sqlEscapeRule.find + '\\b', 'gi');
        queryStr = queryStr.replace(reg, sqlEscapeRule.replace);
      }
    } else if (type) {
      sqlEscapeRules = await strapi.query('sql-escape-rule').find({ type });
      for (const sqlEscapeRule of sqlEscapeRules) {
        const reg = new RegExp('\\b' + sqlEscapeRule.find + '\\b', 'gi');
        queryStr = queryStr.replace(reg, sqlEscapeRule.replace);
      }
    }

    queryStr = querystring.escape(queryStr);
    const url = `http://${config.host}:${config.port}/?database=${config.database}&query=${queryStr}`;

    let response;
    if (config.user) {
      const base64Str = new Buffer.from(
        config.user + ':' + config.password
      ).toString('base64');
      response = await axios({
        method: method,
        url: url,
        headers: { Authorization: 'Basic ' + base64Str },
        timeout: 30000,
      });
    } else {
      response = await axios({
        method: method,
        url: url,
      });
    }

    ctx.response.status = response.status;
    ctx.response.body = response.data;
  },
  async query(sql, method) {
    if (!method) method = 'GET';
    const ctx = {
      query: { query: sql, type: '', target_id: '' },
      response: {},
      request: { method },
    };
    await this.proxy(ctx);
    if (ctx.response && ctx.response.body) {
      return ctx.response.body;
    }
    return 0;
  },
};
