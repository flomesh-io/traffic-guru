'use strict';

/**
 * resource-permission service
 */
 const actionKey = {
    find: ['count', 'fetch', 'get', 'find', 'findOne'],
    create: ['create'],
    update: ['update'],
    delete: ['delete', 'destroy'],
    destroy: ['destroy'],
    audit1st: ['audit1st'],
    audit2nd: ['audit2nd'],
    audit3rd: ['audit3rd'],
  };

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::resource-permission.resource-permission',{
    async getResourcePermission(args) {
        const id = args.id;
        const type = args.type;
    
        const permissions = {};
        let role;
        if (id) {
          role = await strapi.plugin('users-permissions').service('role').findOne(id);
          let roleType;
          if (
            !role.type ||
            (role.type != 'project' && role.type != 'organization')
          ) {
            roleType = 'system';
          } else {
            roleType = role.type
          }
          const resources = await strapi.db.query('api::resource-permission.resource-permission').findMany({where: { type: roleType }});

          for (const permission in role.permissions) {
            if (permission.indexOf("api::") > -1) {
              for (const controller in role.permissions[permission].controllers) {
                const resource = resources.find((r) => r.name == controller);
                if (!resource) continue;
                permissions[permission] = {controllers:{}}
                permissions[permission].controllers[controller] = {}
                for (const key in actionKey) {
                  if (role.permissions[permission].controllers[controller][key] != undefined) {
                    permissions[permission].controllers[controller][key] = {enabled: role.permissions[permission].controllers[controller][key].enabled}
                  }
                }
              }
            } else if (permission == "plugin::users-permissions") {
              let resource = resources.find((r) => r.name == "role");
              if (resource) {
                const permissionNew = "api::" + resource.name;
                permissions[permissionNew] = {
                  controllers: {role:{}}
                }
                permissions[permissionNew] = {};
                permissions[permissionNew].controllers = {};
                permissions[permissionNew].controllers[resource.name] = {}
                for (const action of resource.content.actions) {
                  let enabled
                  switch (action) {
                    case "find":
                      enabled = role.permissions[permission].controllers[resource.name]["find"].enabled
                      break;
                    case "create":
                      enabled = role.permissions[permission].controllers[resource.name]["createRole"].enabled
                      break;
                    case "update":
                      enabled = role.permissions[permission].controllers[resource.name]["updateRole"].enabled
                      break;
                    case "delete":
                      enabled = role.permissions[permission].controllers[resource.name]["deleteRole"].enabled
                      break;
                  
                    default:
                      break;
                  }
                  permissions[permissionNew].controllers[resource.name][action] = {enabled}
                }
              }

              resource = resources.find((r) => r.name == "user");
              if (resource) {
                const permissionNew = "api::" + resource.name;
                permissions[permissionNew] = {
                  controllers: {role:{}}
                }
                permissions[permissionNew] = {};
                permissions[permissionNew].controllers = {};
                permissions[permissionNew].controllers[resource.name] = {}
                for (const action of resource.content.actions) {
                  let enabled
                  switch (action) {
                    case "find":
                      enabled = role.permissions[permission].controllers[resource.name]["find"].enabled
                      break;
                    case "create":
                      enabled = role.permissions[permission].controllers[resource.name]["create"].enabled
                      break;
                    case "update":
                      enabled = role.permissions[permission].controllers[resource.name]["update"].enabled
                      break;
                    case "delete":
                      enabled = role.permissions[permission].controllers[resource.name]["destroy"].enabled
                      break;
                  
                    default:
                      break;
                  }
                  permissions[permissionNew].controllers[resource.name][action] = {enabled}
                }
              }
            }
          }
        } else {
          let resources;
          if (type) {
            resources = await strapi.db.query('api::resource-permission.resource-permission').findMany({where: {type}});
          } else {
            resources = await strapi.db.query('api::resource-permission.resource-permission').findMany();
          }
          role = await strapi.plugin('users-permissions').service('role').findOne(1);
          role.type = type || "system";

          for (const permission in role.permissions) {
            if (permission.indexOf("api::") > -1) {
              for (const controller in role.permissions[permission].controllers) {
                const resource = resources.find((r) => r.name == controller);
                if (!resource) continue;
                permissions[permission] = {controllers:{}}
                permissions[permission].controllers[controller] = {}
                for (const key in actionKey) {
                  if (role.permissions[permission].controllers[controller][key] != undefined) {
                    if (key == "find") {
                      permissions[permission].controllers[controller][key] = { enabled: true}
                    } else {
                      permissions[permission].controllers[controller][key] = { enabled: false}
                    }
                  }
                }
              }
            } else if (permission == "plugin::users-permissions") {
              let resource = resources.find((r) => r.name == "role");
              if (resource) {
                const permission = "api::" + resource.name;
                permissions[permission] = {
                  controllers: {role:{}}
                }
                permissions[permission] = {};
                permissions[permission].controllers = {};
                permissions[permission].controllers[resource.name] = {}
                for (const action of resource.content.actions) {
                  if (action == "find") {
                    permissions[permission].controllers[resource.name][action] = { enabled: true}
                  } else {
                    permissions[permission].controllers[resource.name][action] = { enabled: false}
                  }
                }
              }

              resource = resources.find((r) => r.name == "user");
              if (resource) {
                const permission = "api::" + resource.name;
                permissions[permission] = {
                  controllers: {role:{}}
                }
                permissions[permission] = {};
                permissions[permission].controllers = {};
                permissions[permission].controllers[resource.name] = {}
                for (const action of resource.content.actions) {
                  if (action == "find") {
                    permissions[permission].controllers[resource.name][action] = { enabled: true}
                  } else {
                    permissions[permission].controllers[resource.name][action] = { enabled: false}
                  }
                }
              }
            }
          }
        }
        return {name: role.name, description: role.description, type: role.type, content: role.content, permissions: permissions};
      },
    
      async createRoleResourcePermission(args) {
        await this.copyPermissions(args);
        await strapi.plugin('users-permissions').service('role').createRole(args.data);
        if (args.data.name && args.data.type) {
          const role = await strapi.db.query('plugin::users-permissions.role').findOne({where: {name: args.data.name, type: args.data.type}})
          return role.id;
        }
        return 0;
      },
    
      async updateRoleResourcePermission(args) {
        await this.copyPermissions(args);
        await strapi.plugin('users-permissions').service('role').updateRole(args.id, args.data);
        return 0;
      },
      async deleteRoleResourcePermission(args) {
        const publicRole = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: 'public' } });

        const publicRoleID = publicRole.id;
        if (args.id) {
          const routers = await strapi.db.query("api::router-setting.router-setting").findMany({where: {role: {id: args.id}}})
          if (routers.length) {
            await strapi.db.query("api::router-setting.router-setting").deleteMany({where: {id: routers.map((r) => r.id)}})
          }
        }
        await strapi.plugin('users-permissions').service('role').deleteRole(args.id, publicRoleID);
        return 0;
      },
      async copyPermissions(args) {
        const roleAdmin = await strapi.plugin('users-permissions').service('role').findOne(1);
        if (args.data.type == "organization" || args.data.type == "project") {
          for (const permission in roleAdmin.permissions) {
            for (const controller in roleAdmin.permissions[permission].controllers) {
              for(const action in roleAdmin.permissions[permission].controllers[controller]) {
                roleAdmin.permissions[permission].controllers[controller][action] = false;
              }
            }
          }
        }
        if (args.data.permissions['api::role']) {
          if (!args.data.permissions['api::role'].controllers?.role?.find?.enabled) {
            roleAdmin.permissions['plugin::users-permissions'].controllers['role']["find"].enabled = false;
          } 
          if (!args.data.permissions['api::role'].controllers?.role?.create?.enabled) {
            roleAdmin.permissions['plugin::users-permissions'].controllers['role']["createRole"].enabled = false;
          } 
          if (!args.data.permissions['api::role'].controllers?.role?.update?.enabled) {
            roleAdmin.permissions['plugin::users-permissions'].controllers['role']["updateRole"].enabled = false;
          } 
          if (!args.data.permissions['api::role'].controllers?.role?.delete?.enabled) {
            roleAdmin.permissions['plugin::users-permissions'].controllers['role']["deleteRole"].enabled = false;
          }
          delete args.data.permissions['api::role']
        }
        if (args.data.permissions['api::user']) {
          if (!args.data.permissions['api::user'].controllers?.user?.find?.enabled) {
            roleAdmin.permissions['plugin::users-permissions'].controllers['user']["find"].enabled = false;
          } 
          if (!args.data.permissions['api::user'].controllers?.user?.create?.enabled) {
            roleAdmin.permissions['plugin::users-permissions'].controllers['user']["create"].enabled = false;
          } 
          if (!args.data.permissions['api::user'].controllers?.user?.update?.enabled) {
            roleAdmin.permissions['plugin::users-permissions'].controllers['user']["update"].enabled = false;
          } 
          if (!args.data.permissions['api::user'].controllers?.user?.delete?.enabled) {
            roleAdmin.permissions['plugin::users-permissions'].controllers['user']["destroy"].enabled = false;
          }
          delete args.data.permissions['api::user']
        }
        for (const permission in args.data.permissions) {
          for (const controller in args.data.permissions[permission].controllers) {
            for (const key in actionKey) {
              if (args.data.permissions[permission].controllers[controller][key] != undefined) {
                for (const action of actionKey[key]) {
                  if (roleAdmin.permissions[permission].controllers[controller][action] != undefined) {
                    roleAdmin.permissions[permission].controllers[controller][action] = {enabled: args.data.permissions[permission].controllers[controller][key].enabled}
                  }
                }
              }
            }
          }
        }
        args.data.permissions = roleAdmin.permissions;
      }
});
