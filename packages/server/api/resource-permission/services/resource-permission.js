'use strict';

const actionKey = {
  find: ['count', 'fetch', 'get', 'find'],
  create: ['create'],
  update: ['update'],
  delete: ['delete', 'destroy'],
  audit1st: ['audit1st'],
  audit2nd: ['audit2nd'],
  audit3rd: ['audit3rd'],
};
const types = ['application', 'users-permissions'];

module.exports = {
  async getResourcePermission(ctx) {
    const roleId = ctx.request.query._roleId;
    const type = ctx.request.query._type;

    const pagePermissions = { resources: [] };
    if (roleId) {
      const role = await strapi
        .query('role', 'users-permissions')
        .findOne({ id: roleId });
      if (
        !role.type ||
        (role.type != 'project' && role.type != 'organization')
      ) {
        role.type = 'system';
      }
      const resources = await strapi
        .query('resource-permission')
        .find({ type: role.type });
      resources.forEach(({ name, content }) => {
        const actions = [];
        for (const action of content.actions) {
          const checkaction = this.checkAction(role.permissions, action, name);
          actions.push({ name: action, enabled: checkaction });
        }
        pagePermissions.resources.push({ name, actions });
        pagePermissions.type = role.type;
      });
    } else {
      let resources;
      if (type) {
        resources = await strapi.query('resource-permission').find({ type });
      } else {
        resources = await strapi.query('resource-permission').find();
      }
      resources.forEach(({ name, content, type }) => {
        const actions = [];
        content.actions.forEach((action) => {
          switch (action) {
            case 'find':
              actions.push({ name: action, enabled: true });
              break;
            case 'create':
              actions.push({ name: action, enabled: false });
              break;
            case 'update':
              actions.push({ name: action, enabled: false });
              break;
            case 'delete':
              actions.push({ name: action, enabled: false });
              break;
            case 'audit1st':
              actions.push({ name: action, enabled: false });
              break;
            case 'audit2nd':
              actions.push({ name: action, enabled: false });
              break;
            case 'audit3rd':
              actions.push({ name: action, enabled: false });
              break;
            default:
              break;
          }
        });
        pagePermissions.resources.push({ name, actions });
        pagePermissions.type = type;
      });
    }

    return pagePermissions;
  },

  checkAction(permissions, action, name) {
    const keys = actionKey[action];
    for (const key of keys) {
      const data = permissions.find((a) => {
        return (
          types.indexOf(a.type) > -1 &&
          a.controller == name &&
          a.action.indexOf(key) > -1
        );
      });
      if (data && data.enabled) {
        return true;
      }
    }
    return false;
  },
  async createRoleResourcePermission(ctx) {
    const role = await strapi.query('role', 'users-permissions').create({
      name: ctx.request.body.input.name,
      description: ctx.request.body.input.description,
      type: ctx.request.body.input.type,
    });

    const permissions = await strapi
      .query('permission', 'users-permissions')
      .find({ role: 1, _limit: -1 });

    const newPermissions = [];
    permissions.forEach((permission) => {
      newPermissions.push({
        type: permission.type,
        controller: permission.controller,
        action: permission.action,
        enabled: true,
        role: role.id,
      });
    });
    await strapi
      .query('permission', 'users-permissions')
      .createMany(newPermissions);

    this.setPermissions(ctx, role.id);
    return role.id;
  },

  async updateRoleResourcePermission(ctx) {
    const roleId = ctx.request.body.roleId;
    const permissions = await strapi
      .query('permission', 'users-permissions')
      .find({ role: roleId, type_in: types, enabled: false, _limit: -1 });
    for (const permission of permissions) {
      strapi
        .query('permission', 'users-permissions')
        .update(
          { id: permission.id },
          { enabled: true, name: ctx.request.body.input.name }
        );
    }

    await this.setPermissions(ctx, roleId);
    return roleId;
  },
  async deleteRoleResourcePermission(ctx) {
    const roleId = ctx.request.body.roleId;
    await strapi
      .query('permission', 'users-permissions')
      .delete({ role: roleId });
    await strapi.query('role', 'users-permissions').delete({ id: roleId });

    return roleId;
  },
  async setPermissions(ctx, roleId) {
    for (const resource of ctx.request.body.input.resources) {
      for (const { name, enabled } of resource.actions) {
        if (!enabled) {
          await this.updatePermissions(roleId, name, resource);
        }
      }
    }
  },
  async updatePermissions(roleId, name, resource) {
    for (const key of actionKey[name]) {
      const userPermissions = await strapi
        .query('permission', 'users-permissions')
        .find({
          role: roleId,
          type_in: types,
          controller: resource.name,
          action_contains: key,
          _limit: -1,
        });
      for (const userPermission of userPermissions) {
        strapi
          .query('permission', 'users-permissions')
          .update({ id: userPermission.id }, { enabled: false });
      }
    }
  },
};
