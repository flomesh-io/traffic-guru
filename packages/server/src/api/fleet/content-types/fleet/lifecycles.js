"use strict";

const resourceTypes = new Set();
resourceTypes.add('sidecar');
resourceTypes.add('upstream');
resourceTypes.add('pipy');
resourceTypes.add('pipy4lb');
resourceTypes.add('checkpoint');

module.exports = {
  afterCreate: async (event) => {

    if (!event || !event.result.type) return;
    

    if (event.result.type === 'clickhouse' && event.result.apply) {
      const clickhouses = await strapi.db.query('api::fleet.fleet').findMany({
        where: {
          type: 'clickhouse',
          apply: true,
          id: { $ne: event.result.id },
        }, limit: 99999
      });

      for (const clickhouse of clickhouses) {
        strapi.db.query('api::fleet.fleet').update({ id: clickhouse.id }, { apply: false });
      }
    }
    if (event.result.type === 'clickhouse' && !event.result.apply) {
      const clickhouses = await strapi.db.query('api::fleet.fleet').findMany({ where: { type: 'clickhouse' } });
      if (clickhouses.length == 1) {
        strapi.db.query('api::fleet.fleet').update({ id: clickhouses[0].id }, { apply: false });
      }
    }
    if (event.result.type === 'log' && event.result.apply) {
      const logs = await strapi.db.query('api::fleet.fleet').findMany({
        where: {
          type: 'log',
          apply: true,
          id: { $ne: event.result.id },
        }, limit: 99999
      });

      for (const log of logs) {
        strapi.db.query('api::fleet.fleet').update({ id: log.id }, { apply: false });
      }
    }
    if (event.result.type === 'log' && !event.result.apply) {
      const logs = await strapi.db.query('api::fleet.fleet').findMany({ where: { type: 'log' } });
      if (logs.length == 1) {
        strapi.db.query('api::fleet.fleet').update({ id: logs[0].id }, { apply: false });
      }
    }
    if (event.result.type === 'log' || event.result.type === 'clickhouse') {
      try {
        await strapi.service("api::clickhouse.clickhouse").createTable(event.result);
      } catch (error) {
        console.error(error);
      }
    }
  },
  afterUpdate: async (event) => {
    if (!event || !event.result.type) return;

    if (event.result.type === 'clickhouse' && event.result.apply && !event.params?.data?.unhealthy) {
      const clickhouses = await strapi.db.query('api::fleet.fleet').findMany({
        where: {
          type: 'clickhouse',
          apply: true,
          id: { $ne: event.result.id },
        }, limit: 99999
      });

      for (const clickhouse of clickhouses) {
        strapi.db.query('api::fleet.fleet').update({ where: { id: clickhouse.id }, data: { apply: false } });
      }
    }
    if (event.result.type === 'log' && event.result.apply) {
      const logs = await strapi.db.query('api::fleet.fleet').findMany({
        where: {
          type: 'log',
          apply: true,
          id: { $ne: event.result.id },
        }, limit: 99999
      });

      for (const log of logs) {
        strapi.db.query('api::fleet.fleet').update({ where: { id: log.id }, data: { apply: false } });
      }
    }

    // remove config cache file
    if (event.result.type === 'kubernetes') {
      const path = require('path');
      const os = require('os');
      const fs = require('fs');
      const util = require('util');
      const KUBE_CONFIG_DIR = path.join(os.tmpdir());
      const kubeconfigPath = path.join(
        KUBE_CONFIG_DIR,
        `${event.result.id}.kubeconfig`
      );
      try {
        const fsOpenAsync = util.promisify(fs.open);
        await fsOpenAsync(kubeconfigPath);
        fs.unlinkSync(kubeconfigPath);
        strapi.log.debug(kubeconfigPath);
      } catch (err) { }
    }
    // if (event.result.type === 'pipy') {
    //   const apis = await strapi.db
    //     .query('api::api.api')
    //     .findMany({ where: { pipy: event.result.id }, limit: 99999 });
    //   strapi.log.info('deploy all api ', apis.length);
    //   if (apis.length > 0) {
    //     for (const api of apis) {
    //       if (api.step === 2) {
    //         await strapi.service("api::api.api").deploy(api);
    //       }
    //     }
    //   }
    // }


  },
  afterDelete: async (event) => {
    try {
      const { result } = event;

      if (result.type === 'clickhouse') {
        const clickhouses = await strapi.db.query('api::fleet.fleet').findOne({
          where: {
            type: 'clickhouse',
            apply: true,
          }
        });

        if (!clickhouses) {
          const ch = await strapi.db.query('api::fleet.fleet').findOne({
            where: {
              type: 'clickhouse',
            }
          });
          if (ch) {
            strapi.db.query('api::fleet.fleet').update({ where: { id: ch.id }, data: { apply: true } });
          }
        }
      }
      if (result.type === 'log') {
        const logs = await strapi.db.query('api::fleet.fleet').findOne({
          where: {
            type: 'log',
            apply: true,
          }
        });

        if (!logs) {
          const log = await strapi.db.query('api::fleet.fleet').findOne({
            where: {
              type: 'log',
            }
          });
          strapi.db.query('api::fleet.fleet').update({ where: { id: log.id }, data: { apply: true } });
        }
      }
    } catch (error) {
      console.error(error);
    }
  },

};  