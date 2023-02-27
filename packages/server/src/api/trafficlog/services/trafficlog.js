'use strict';

/**
 * trafficlog service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::trafficlog.trafficlog',{
    async getErrStatusAlarms(scaleTime) {
        const alarms = [];
        const errStatusLogs = await strapi.service("api::clickhouse.clickhouse").query(`
          SELECT x_parameters.aid, toString(toDateTime(reqTime/1000)), res.status
          FROM log
          WHERE timestamp > toDateTime(toUnixTimestamp(now64())-${scaleTime})
          AND res.status >= 400
        `);
    
        if (errStatusLogs == 0) {
          return alarms;
        }
        for (const errLog of errStatusLogs.split('\n')) {
          if (
            typeof errLog === 'undefined' ||
            errLog === null ||
            errLog === '' ||
            errLog.length == 0
          ) {
            continue;
          }
          const alarmItemFields = errLog.split('\t');
          const alarmItem = {};
          alarmItem.aid = alarmItemFields[0];
          alarmItem.reqTime = alarmItemFields[1];
          alarmItem.resStatus = alarmItemFields[2];
          alarms.push(alarmItem);
        }
        return alarms;
      },
});
