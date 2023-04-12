'use strict';

/**
 * trafficlog controller
 */
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
  // async traces(ctx) {
  //   const jeager = await strapi.db.query('api::fleet.fleet').findOne({where: { type: 'jeager' }});
  //   if (!jeager) {
  //     return { status: 404, error: 'Please add the jeager component first!' };
  //   }
  //   const tracesAxios = axios.create({
  //     baseURL: jeager.content.server,
  //     headers: { 'Content-Type': 'application/json' },
  //   });

  //   strapi.log.info('------> trafficlog.traces');
  //   const tracesQuery = ctx.query._input;

  //   const response = await tracesAxios.get('/api/traces', {
  //     params: tracesQuery,
  //   });
  //   if (response.status == 200) {
  //     return response.data;
  //   } else {
  //     return { status: response.status, error: response.statusText };
  //   }
  // },

  async logs(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').logs2Clickhouse(reqBody, fleet.content);
      }
      else if(fleet.type === 'postgresql'){
        return await strapi.service('api::trafficlog.trafficlog').logs2Postgresql(reqBody, fleet.content);
      } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },

  async querylogs(ctx) {
    // strapi.log.debug(JSON.stringify(ctx.request.body));
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').queryLogs2Clickhouse(reqBody, fleet.content);
      }
      else if(fleet.type === 'postgresql'){
        return await strapi.service('api::trafficlog.trafficlog').queryLogs2Postgresql(reqBody, fleet.content);
      } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },

  async querysvclogs(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').querySvcLogs2Clickhouse(reqBody, fleet.content);
      }
      else if(fleet.type === 'postgresql'){
        return await strapi.service('api::trafficlog.trafficlog').querySvcLogs2Postgresql(reqBody, fleet.content);
      } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },

  async countlatency(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').countLatency2Clickhouse(reqBody, fleet.content);
      }
      else if(fleet.type === 'postgresql'){
        return await strapi.service('api::trafficlog.trafficlog').countLatency2Postgresql(reqBody, fleet.content);
      } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },

  async countstatus(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').countStatus2Clickhouse(reqBody, fleet.content);
      }
      else if(fleet.type === 'postgresql'){
        return await strapi.service('api::trafficlog.trafficlog').countStatus2Postgresql(reqBody, fleet.content);
      } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },

  async counttps(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').countTps2Clickhouse(reqBody, fleet.content);
      }
      else if(fleet.type === 'postgresql'){
        return await strapi.service('api::trafficlog.trafficlog').countTps2Postgresql(reqBody, fleet.content);
      } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },

  async totaltps(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').totalTps2Clickhouse(reqBody, fleet.content);
      }
      else if(fleet.type === 'postgresql'){
        return await strapi.service('api::trafficlog.trafficlog').totalTps2Postgresql(reqBody, fleet.content);
      } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },


  async traceList(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').traceList2Clickhouse(reqBody, fleet.content);
      }
      // else if(fleet.type === 'postgresql'){
      //   return await strapi.service('api::trafficlog.trafficlog').traceList2Postgresql(reqBody, fleet.content);
      // } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },

  async traceDetail(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').traceDetail2Clickhouse(reqBody, fleet.content);
      }
      // else if(fleet.type === 'postgresql'){
      //   return await strapi.service('api::trafficlog.trafficlog').traceDetail2Postgresql(reqBody, fleet.content);
      // } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  },
  
  async traceDag(ctx) {
    try {
      const fleet = await strapi.service('api::trafficlog.trafficlog').getLogFleet();
      const reqBody = ctx.request.body;
      //strapi.log.debug(JSON.stringify(reqBody));
      if(fleet.type === 'clickhouse'){
        return await strapi.service('api::trafficlog.trafficlog').traceDag2Clickhouse(reqBody, fleet.content);
      }
      // else if(fleet.type === 'postgresql'){
      //   return await strapi.service('api::trafficlog.trafficlog').traceDetail2Postgresql(reqBody, fleet.content);
      // } 
      //error return
      return {error: fleet.type + ' not supported'};
    } catch (error) {
      strapi.log.error(error);
      return {error: error.toString()};
    }
  }

});
