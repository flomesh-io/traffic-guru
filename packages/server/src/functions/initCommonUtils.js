'use strict';
const adminRoleId = 1
const publicRoleId = 2
module.exports = {
  async init() {
    // enable admin permissions
    const role = await strapi.plugin('users-permissions').service('role').findOne(adminRoleId);
    for (const permission in role.permissions) {
      for (const controller in role.permissions[permission].controllers) {
        for (const action in role.permissions[permission].controllers[controller]) {
          if (!role.permissions[permission].controllers[controller][action].enabled) {
            role.permissions[permission].controllers[controller][action].enabled = true;
          }
        }
      }
    }
    await strapi.plugin('users-permissions').service('role').updateRole(adminRoleId, role);

    const rolePublic = await strapi.plugin('users-permissions').service('role').findOne(publicRoleId);
    rolePublic.permissions["api::router-setting"].controllers["router-setting"]["find"].enabled = true;
    await strapi.plugin('users-permissions').service('role').updateRole(publicRoleId, rolePublic);

    // add admin user
    // const userCount = await strapi.db.query('plugin::users-permissions.user').count();
    // if (userCount == 0) {
    //   const adminUser = {
    //     username: 'admin',
    //     email: 'admin@flomesh.cn',
    //     password: 'flomesh123',
    //     role: 1,
    //     confirmed: true,
    //     blocked: false,
    //     provider: "local"
    //   }
    //   await strapi.plugin('users-permissions').service('user').add(adminUser);
    // }

    // init components
    const envs = process.env
    const components = {}
    const componentsTypes = ["clickhouse","prometheus"]
    for (const env in envs) {
      const keys = env.toLowerCase().split("_")
      if (keys.length == 3 && keys[0] == "component" && componentsTypes.indexOf(keys[1]) > -1) {
        if (!components[keys[1]]) {
          components[keys[1]] = {}
        }
        components[keys[1]][keys[2]] = envs[env]
      }
    }
    for (const component in components) {
      const dbComponent = await strapi.db
        .query('api::fleet.fleet')
        .findOne({where: {name: component}});
      if (!dbComponent) {
        try {
          strapi.log.info("init component: " + component)
          await strapi.db
            .query('api::fleet.fleet')
            .create({data: {name: component,  type: component, content: components[component]}});
        } catch (error) {
          console.error(error)
        }
      }
    }


    const emailConf = await strapi.db.query('api::system-setting.system-setting').findOne({where: {type: 'EmailConf'}});
    if (!emailConf) {
      const systemSettingEmailConf = {
        auth: {
          pass: 'oCSGerZusMB262dU',
          user: 'john@flomesh.cn',
        },
        port: 465,
        service: 'QQex',
        secureConnection: true,
        enabled: true
      };
      await strapi.db.query('api::system-setting.system-setting').create({
        data: {
          type: 'EmailConf',
          mode: 'global',
          content: systemSettingEmailConf,
        }
      });
    }
  }
};
