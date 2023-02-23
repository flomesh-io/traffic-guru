'use strict';

/**
 * router-setting controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

async function createFullRouterSettings(routerItems, parentId) {
    strapi.log.info('======>>>>>> createRouteSettings ......');
    for (let idx = 0; idx < routerItems.length; idx++) {
      const childRouterItems = routerItems[idx].children;
      routerItems[idx].children = [];
      // Create the current menu entry
      routerItems[idx].parent = parentId;
      const createdRouter = await strapi.db
        .query('api::router-setting.router-setting')
        .create({data: routerItems[idx]});
      const routerId = createdRouter.id;
      // Read the submenu information of the current menu
      if (
        Array.prototype.isPrototypeOf(childRouterItems) &&
        childRouterItems.length > 0
      ) {
        await createFullRouterSettings(childRouterItems, routerId);
      }
    }
  }

module.exports = createCoreController('api::router-setting.router-setting',{
    async batchCreateRouterSetting(args,) {
        strapi.log.info('------> routerSetting.batch');
        const routerItems = args.data;
        if (Array.prototype.isPrototypeOf(routerItems)) {
          // Delete all the old menu data first
          await strapi.db.query('api::router-setting.router-setting').deleteMany({});
          // Insert new menu data
          await createFullRouterSettings(routerItems);
          return { msg: 'ok' };
        } else {
          return { msg: 'No menu data' };
        }
      },
});
