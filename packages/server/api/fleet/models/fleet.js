'use strict';

module.exports = {
  lifecycles: {
    afterCreate: async (result, data) => {
      strapi.log.info('afterCreate', data);
      if (!data || !data.type) return;

      if (result.type === 'clickhouse' && result.apply) {
        const clickhouses = await strapi.query('fleet').find({
          type: 'clickhouse',
          apply: true,
          id_ne: result.id,
          _limit: -1,
        });

        for (const clickhouse of clickhouses) {
          strapi.query('fleet').update({ id: clickhouse.id }, { apply: false });
        }
      }
    },
    afterUpdate: async (result, params, data) => {
      if (!data || !data.type) return;

      if (result.type === 'clickhouse' && result.apply) {
        const clickhouses = await strapi.query('fleet').find({
          type: 'clickhouse',
          apply: true,
          id_ne: result.id,
          _limit: -1,
        });

        for (const clickhouse of clickhouses) {
          strapi.query('fleet').update({ id: clickhouse.id }, { apply: false });
        }
      }
      if (result.type === 'clickhouse') {
        const ingresses = await strapi.query('fleet').find({
          content_contains: `"type":"clickhouse","bind":{"id":"${result.id}"}`,
        });

        if (ingresses && ingresses.length > 0) {
          for (const ingress of ingresses) {
            const ing = await strapi
              .query('fleet')
              .update({ id: ingress.id }, { version: ingress.version + 1 });
            await strapi.services.fleet.deploy(ing);
          }
        }
      }

      // remove config cache file
      if (result.type === 'kubernetes') {
        const path = require('path');
        const os = require('os');
        const fs = require('fs');
        const util = require('util');
        const KUBE_CONFIG_DIR = path.join(os.tmpdir());
        const kubeconfigPath = path.join(
          KUBE_CONFIG_DIR,
          `${result.id}.kubeconfig`
        );
        try {
          const fsOpenAsync = util.promisify(fs.open);
          await fsOpenAsync(kubeconfigPath);
          fs.unlinkSync(kubeconfigPath);
          strapi.log.debug(kubeconfigPath);
        } catch (err) {}
      }
    },
    afterDelete: async (result) => {
      try {
        if (result.type === 'clickhouse') {
          const clickhouses = await strapi.query('fleet').findOne({
            type: 'clickhouse',
            apply: true,
          });

          if (!clickhouses) {
            const ch = await strapi.query('fleet').findOne({
              type: 'clickhouse',
            });
            strapi.query('fleet').update({ id: ch.id }, { apply: true });
          }
        }
      } catch (error) {
        strapi.log.error(error);
      }
    },
  },
};
