'use strict';

const types = ['application', 'users-permissions'];

module.exports = async () => {
  const initDBData = async () => {
    await strapi.config.functions.initUtils.init();

    const publicResource_app = [];
    const publicResource_user = ['auth'];
    let publicPermissions = await strapi
      .query('permission', 'users-permissions')
      .find({
        role: 2,
        enabled: true,
        type: 'application',
        controller_nin: publicResource_app,
        _limit: -1,
      });
    for (const permission of publicPermissions) {
      await strapi
        .query('permission', 'users-permissions')
        .update({ id: permission.id }, { enabled: false });
    }
    publicPermissions = await strapi
      .query('permission', 'users-permissions')
      .find({
        role: 2,
        enabled: true,
        type: 'users-permissions',
        controller_nin: publicResource_user,
        _limit: -1,
      });
    for (const permission of publicPermissions) {
      await strapi
        .query('permission', 'users-permissions')
        .update({ id: permission.id }, { enabled: false });
    }
    await strapi
      .query('permission', 'users-permissions')
      .update(
        { role: 2, controller: 'router-setting', action: 'find' },
        { enabled: true }
      );

    const adminpermissions = await strapi
      .query('permission', 'users-permissions')
      .find({ role: 1, enabled: false, _limit: -1 });
    for (const permission of adminpermissions) {
      await strapi
        .query('permission', 'users-permissions')
        .update({ id: permission.id }, { enabled: true });
    }
    const resource_permission = await strapi
      .query('resource-permission')
      .find();
    const resource = resource_permission.map((r) => r.name);
    const permissions = await strapi
      .query('permission', 'users-permissions')
      .find({
        type_in: types,
        enabled: false,
        role_nin: [2],
        controller_nin: resource,
        _limit: -1,
      });
    for (const permission of permissions) {
      await strapi
        .query('permission', 'users-permissions')
        .update({ id: permission.id }, { enabled: true });
    }

    const clickhouses = await strapi
      .query('fleet')
      .find({ type: 'clickhouse' });
    const clickhousesApply = await strapi
      .query('fleet')
      .find({ type: 'clickhouse', apply: true });
    if (clickhouses.length > 0 && clickhousesApply.length == 0) {
      await strapi
        .query('fleet')
        .update({ type: 'clickhouse' }, { apply: true, type: 'clickhouse' });
    }
  };

  await initDBData();
};
