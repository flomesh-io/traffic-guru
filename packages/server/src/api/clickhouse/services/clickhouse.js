'use strict';

/**
 * clickhouse service
 */

const { createCoreService } = require('@strapi/strapi').factories;

const axios = require('axios');
axios.defaults.timeout = 3000
const querystring = require('querystring');
const fs = require('fs');

module.exports = createCoreService('api::clickhouse.clickhouse', {
  async ping (id) {
    const fleet = await strapi.db.query('api::fleet.fleet').findOne({ where: { id } });
    const config = fleet.content;
    const queryStr = "select count() from system.tables";
    const url = `http://${config.host}:${config.port}/?database=${config.database}&query=${queryStr}`;

    let response;
    try {
      if (config.user) {
        const base64Str = new Buffer.from(
          config.user + ':' + config.password
        ).toString('base64');
        response = await axios({
          method: "get",
          url: url,
          headers: { Authorization: 'Basic ' + base64Str },
          timeout: 3000,
        });
      } else {
        response = await axios({
          method: "get",
          url: url,
        });
      }
      if (response.status == 200) {
        return "running"
      }
      return "error"
    } catch (error) {
      return "error"
    }
  },
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
    try {
      if (config.user) {
        const base64Str = new Buffer.from(
          config.user + ':' + config.password
        ).toString('base64');
        response = await axios({
          method: method,
          url: url,
          headers: { Authorization: 'Basic ' + base64Str },
          timeout: 3000,
        });
      } else {
        response = await axios({
          method: method,
          url: url,
        });
      }
      ctx.response.status = response.status;
      ctx.response.body = response.data;
    } catch (error) {
      ctx.response.status = 504;
      ctx.response.message = "Unable to connect to clickhouse: " + error.message;
    }
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

  async createTable (result, type) {
    let db = null;
    let tableName = null;
    let ddlName = "log.ddl";

    if (result.type == "log" && result.content.type == "clickhouse") {
      db = await strapi.db.query("api::fleet.fleet").findOne({where: {id: result.content.bind.id}})
    } else if (result.type == "clickhouse") {
      db = result
    }

    if (!type || type == "log") {
      if (result.type == "log" && result.content.type == "clickhouse") {
        tableName = result.content.table
      } else if (result.type == "clickhouse") {
        tableName = "log"
      }
      ddlName = "log.ddl";
    } else if (type == "healthcheckLog") {
      tableName = "healthcheckLog"
      ddlName = "healthcheckLog.ddl";
    } else if (type == "bgpLog") {
      tableName = "bgpLog"
      ddlName = "bgpLog.ddl";
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
          timeout: 3000,
        });
      } else {
        response = await axios({
          method: method,
          url: urlQueryTable,
          timeout: 3000,
        });
      }
      
      if (response.data == 0) {
        const ddl = fs.readFileSync(`${__dirname}/${ddlName}`, 'utf8');

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
            timeout: 3000,
          });
        } else {
          response = await axios({
            method: method,
            url: urlCreateTable,
            timeout: 3000,
          });
        }
      }
    } catch (error) {
    }
  },
});
