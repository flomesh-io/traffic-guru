'use strict';

/**
 * api-dashboard service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::api-dashboard.api-dashboard', {
    dateFormat(date) {
        let format = 'm-d';
        const format_arr = {
          Y: date.getFullYear(),
          m:
            date.getMonth() + 1 >= 10
              ? date.getMonth() + 1
              : '0' + (date.getMonth() + 1),
          d: date.getDate() >= 10 ? date.getDate() : '0' + date.getDate(),
          H: date.getHours(),
          i: date.getMinutes(),
          s: date.getSeconds(),
        };
        for (const key in format_arr) {
          format = format.replace(key, format_arr[key]);
        }
        return format;
      },
      async getApiDashboardPageInfo(args) {
        const apiId = args.filters.apiId;
        const projectId = args.filters.projectId;
    
        let queryWhere;
        let queryApplicationWhere = null;
        if (apiId) {
          queryWhere = { id: apiId };
        } else if (projectId) {
          queryWhere = { project: projectId, step: 2 };
          queryApplicationWhere = { project: projectId };
        } else {
          queryWhere = { step: 2 };
        }
    
        const apis = await strapi.db.query('api::api.api').findMany({where: queryWhere});
        const api_summary = await strapi.db.query('api::api.api').count({where: queryWhere});
        let api_run_summary = api_summary;
        let api_error_summary = 0;
    
        const api_target_week = [
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          { type: 'success', date: this.dateFormat(new Date()), value: 0 },
          { type: 'fail', date: this.dateFormat(new Date()), value: 0 },
        ];
    
        const api_target_month = [
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 21 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 21 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'success',
            date: this.dateFormat(
              new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          {
            type: 'fail',
            date: this.dateFormat(
              new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
            ),
            value: 0,
          },
          { type: 'success', date: this.dateFormat(new Date()), value: 0 },
          { type: 'fail', date: this.dateFormat(new Date()), value: 0 },
        ];
    
        if (apis && apis.length) {
          let aidVals = '';
          for (const api of apis) {
            aidVals += ",'" + api.id + "'";
          }
          aidVals = aidVals.replace(',', '');
          api_error_summary = await strapi.service("api::clickhouse.clickhouse")
            .query(`select count(1) 
          from (
            select reqTime,res.status,x_parameters.aid from log a
            inner join (select max(reqTime) as reqTime from log group by x_parameters.aid) b
            on a.reqTime=b.reqTime
          )
          where res.status >= 400 and x_parameters.aid in (${aidVals})`);
    
          api_run_summary = api_summary - api_error_summary;
    
          const week = await strapi.service("api::clickhouse.clickhouse")
            .query(`SELECT toStartOfDay(timestamp) as days, count(1), SUBSTRING(toString(days),6,5) as md, 'success' as status 
          FROM log where res.status < 400 and timestamp > subtractMonths(now(),1) and x_parameters.aid in (${aidVals}) group by days order by days desc
          UNION all
          SELECT toStartOfDay(timestamp) as days, count(1), SUBSTRING(toString(days),6,5) as md, 'fail' as status 
          FROM log where res.status >= 400 and timestamp > subtractMonths(now(),1) and x_parameters.aid in (${aidVals}) group by days order by days desc`);
    
          if (week) {
            const nodes = week.split('\n');
            nodes.map((nodeStr) => {
              const node = nodeStr.split('\t');
              const target = api_target_week.find(
                (o) => o.date == node[2] && o.type == node[3]
              );
              if (target) target.value = node[1];
            });
          }
    
          const month = await strapi.service("api::clickhouse.clickhouse")
            .query(`SELECT toStartOfWeek(timestamp) as days, count(1), SUBSTRING(toString(days),6,5) as md, 'success' as status 
          FROM log where res.status < 400 and timestamp > subtractMonths(now(),1) and x_parameters.aid in (${aidVals}) group by days order by days desc
          UNION all
          SELECT toStartOfWeek(timestamp) as days, count(1), SUBSTRING(toString(days),6,5) as md, 'fail' as status 
          FROM log where res.status >= 400 and timestamp > subtractMonths(now(),1) and x_parameters.aid in (${aidVals}) group by days order by days desc`);
    
          if (month) {
            const nodes = month.split('\n');
            nodes.map((nodeStr) => {
              const node = nodeStr.split('\t');
              const target = api_target_month.find(
                (o) => o.date > node[2] && o.type == node[3]
              );
              if (target) target.value = node[1];
            });
          }
        }
    
        const applications = await strapi.db
          .query('api::application.application')
          .findMany({where: queryApplicationWhere});
        const application_summary = await strapi.db
        .query('api::application.application')
          .count({where: queryApplicationWhere});
    
        let application_run_summary = application_summary;
        let application_error_summary = 0;
        if (applications && applications.length) {
          let appidVals = '';
          for (const application of applications) {
            appidVals += ",'" + application.id + "'";
          }
          appidVals = appidVals.replace(',', '');
          application_error_summary = await strapi.service("api::clickhouse.clickhouse")
            .query(`select count(1) 
          from (
            select reqTime,res.status,x_parameters.appid from log a
                inner join (select max(reqTime) as reqTime from log group by x_parameters.appid) b
                on a.reqTime=b.reqTime
                )
                where res.status >= 400 and x_parameters.appid in (${appidVals})`);
          application_run_summary = application_summary - application_error_summary;
        }
    
        const obj = {
          apis: {
            total: api_summary,
            run: api_run_summary,
            error: api_error_summary,
          },
    
          applications: {
            total: application_summary,
            run: application_run_summary,
            error: application_error_summary,
          },
    
          api_status: {
            run: api_run_summary,
            error: api_error_summary,
          },
    
          api_week: api_target_week,
          api_month: api_target_month,
        };
        return obj;
      },
});
