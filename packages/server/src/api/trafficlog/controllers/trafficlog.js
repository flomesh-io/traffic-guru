'use strict';

/**
 * trafficlog controller
 */
const axios = require('axios');
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::trafficlog.trafficlog',{
  // async batch(ctx) {
  //   strapi.log.info('------> trafficlog.batch');
  //   const logs = ctx.request.body.logs;
  //   logs.forEach((element) => {
  //     strapi.query('trafficlog').create(element);
  //   });
  //   return 'OK';
  // },

  // async metrics(ctx) {
  //   strapi.log.info('------> trafficlog.metrics');
  //   const reqQuery = ctx.query;
  //   if (Object.keys(reqQuery).length === 0) {
  //     return 'Query Nothing!';
  //   }
  //   const pgSql =
  //     await strapi.config.functions.sqlTranslator.clickhouse2postgresql(
  //       reqQuery.query
  //     );
  //   return pgSql;
  // },

  // get jeager traces
  async traces(ctx) {
    const jeager = await strapi.query('fleet').findOne({ type: 'jeager' });
    if (!jeager) {
      return { status: 404, error: 'Please add the jeager component first!' };
    }

    const tracesAxios = axios.create({
      baseURL: jeager.content.server,
      headers: { 'Content-Type': 'application/json' },
    });

    strapi.log.info('------> trafficlog.traces');
    const tracesQuery = ctx.query._input;

    const response = await tracesAxios.get('/api/traces', {
      params: tracesQuery,
    });
    if (response.status == 200) {
      return response.data;
    } else {
      return { status: response.status, error: response.statusText };
    }
  }

});
