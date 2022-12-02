'use strict';

async function createFullRouterSettings(routerItems, parentId) {
  strapi.log.info('======>>>>>> createRouteSettings ......');
  for (let idx = 0; idx < routerItems.length; idx++) {
    const childRouterItems = routerItems[idx].children;
    routerItems[idx].children = [];
    // Create the current menu entry
    routerItems[idx].parent = parentId;
    const createdRouter = await strapi
      .query('router-setting')
      .create(routerItems[idx]);
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

module.exports = {
  async batchCreateRouterSetting(ctx) {
    strapi.log.info('------> routerSetting.batch');
    const routerItems = ctx.request.body.input;
    if (Array.prototype.isPrototypeOf(routerItems)) {
      // Delete all the old menu data first
      await strapi.query('router-setting').delete();
      // Insert new menu data
      await createFullRouterSettings(routerItems);
      return { msg: 'ok' };
    } else {
      return { msg: 'No menu data' };
    }
  },
};
