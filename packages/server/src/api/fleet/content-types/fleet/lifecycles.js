"use strict";

const resourceTypes = new Set();
resourceTypes.add('sidecar');
resourceTypes.add('upstream');
resourceTypes.add('pipy');
resourceTypes.add('pipy4lb');
resourceTypes.add('pipy4lb');
resourceTypes.add('tunnelInternal');
resourceTypes.add('tunnelExternal');

module.exports = {
  beforeCreate: async (event) => {
    const data = event.params.data;
    data.version = 2;
  },
  afterCreate: async (event) => {

    if (!event || !event.result.type) return;
    

    if ((event.result.type === 'clickhouse' || event.result.type === 'log' || event.result.type === 'prometheus') && event.result.apply) {
      const fleets = await strapi.db.query('api::fleet.fleet').findMany({
        where: {
          type: event.result.type,
          apply: true,
          id: { $ne: event.result.id },
        }, limit: 99999
      });

      for (const fleet of fleets) {
        strapi.db.query('api::fleet.fleet').update({ id: fleet.id }, { apply: false });
      }
    }

    if ((event.result.type === 'clickhouse' || event.result.type === 'log' || event.result.type === 'prometheus') && !event.result.apply) {
      const fleets = await strapi.db.query('api::fleet.fleet').findMany({ where: { type: event.result.type } });
      if (fleets.length == 1) {
        strapi.db.query('api::fleet.fleet').update({ where: { id: fleets[0].id }, data: { apply: false } });
      }
    }
    if (event.result.type === 'log' || event.result.type === 'clickhouse') {
      try {
        await strapi.service("api::clickhouse.clickhouse").createTable(event.result);
        await strapi.service("api::clickhouse.clickhouse").createTable(event.result, "healthcheckLog");
        await strapi.service("api::clickhouse.clickhouse").createTable(event.result, "bgpLog");
      } catch (error) {
        console.error(error);
      }
    }
  },
  afterUpdate: async (event) => {
    if (!event || !event.result.type) return;

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