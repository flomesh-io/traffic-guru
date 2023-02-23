'use strict';

/**
 * clickhouse service
 */

const { createCoreService } = require('@strapi/strapi').factories;

const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');

module.exports = createCoreService('api::clickhouse.clickhouse', {
  async proxy (ctx) {
    const log = await strapi.db.query('api::fleet.fleet').findOne({ where: { type: 'log', apply: true } });
    let fleet = null
    if (log == null) {
      fleet = await strapi.db.query('api::fleet.fleet').findOne({ where: { type: 'clickhouse', apply: true} });
    } else {
      fleet = await strapi.db.query('api::fleet.fleet').findOne({ where: { id: log.content.bind.id } });
    }
    if (fleet == null) {
      return;
    }

    const config = fleet.content;
    const method = ctx.request.method;

    let sqlEscapeRules = await strapi.db.query("api::sql-escape-rule.sql-escape-rule").findMany({ where: { type: { $null: true } } });
    let queryStr = ctx.query.query;
    const type = ctx.query.type;
    const target_id = ctx.query.id;
    for (const sqlEscapeRule of sqlEscapeRules) {
      const reg = new RegExp('\\b' + sqlEscapeRule.find + '\\b', 'gi');
      queryStr = queryStr.replace(reg, sqlEscapeRule.replace);
    }

    if (type && target_id) {
      sqlEscapeRules = await strapi.db.query("api::sql-escape-rule.sql-escape-rule").findMany({ where: { type, target_id } });
      for (const sqlEscapeRule of sqlEscapeRules) {
        const reg = new RegExp('\\b' + sqlEscapeRule.find + '\\b', 'gi');
        queryStr = queryStr.replace(reg, sqlEscapeRule.replace);
      }
    } else if (type) {
      sqlEscapeRules = await strapi.db.query("api::sql-escape-rule.sql-escape-rule").findMany({ where: { type } });
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
  async query (sql, method) {
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

  async createTable (result) {
    let db = null;
    let tableName = null;
    if (result.type == "log" && result.content.type == "clickhouse") {
      db = await strapi.db.query("api::fleet.fleet").findOne({where: {id: result.content.bind.id}})
      tableName = result.content.table
    } else if (result.type == "clickhouse") {
      db = result
      tableName = "log"
    }

    const config = db.content;
    const method = 'POST';

    let queryTable = `select count() from system.tables where name ='${tableName}'`;

    queryTable = querystring.escape(queryTable);
    const urlQueryTable = `http://${config.host}:${config.port}/?database=${config.database}&query=${queryTable}`;
    let response;
    try {
      if (config.user) {
        const base64Str = new Buffer.from(
          config.user + ':' + config.password
        ).toString('base64');
        response = await axios({
          method: method,
          url: urlQueryTable,
          headers: { Authorization: 'Basic ' + base64Str },
          timeout: 30000,
        });
      } else {
        response = await axios({
          method: method,
          url: urlQueryTable,
        });
      }

      console.log(queryTable,urlQueryTable)
      if (response.data == 0) {
        const ddl = fs.readFileSync(`${__dirname}/log.ddl`, 'utf8');

        let createTable = ddl.replace('default.log', tableName);
        createTable = querystring.escape(createTable);
        const urlCreateTable = `http://${config.host}:${config.port}/?database=${config.database}&query=${createTable}`;

        if (config.user) {
          const base64Str = new Buffer.from(
            config.user + ':' + config.password
          ).toString('base64');
          response = await axios({
            method: method,
            url: urlCreateTable,
            headers: { Authorization: 'Basic ' + base64Str },
            timeout: 30000,
          });
        } else {
          response = await axios({
            method: method,
            url: urlCreateTable,
          });
        }
      }
    } catch (error) {
      strapi.log.error(error);
    }
  },
});
