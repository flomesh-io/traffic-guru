"use strict";

module.exports = {
  beforeCreate: async (data) => {
    if (data.type == 'organization') {
      const role = await strapi.db.query('plugin::users-permissions.role')
        .findOne({where: { id: data.role }});
      const msg =
        'You have been assigned an organization ' + role.name + ' permission';
      await strapi.db.query('api::message.message').create({where: {
        type: 'system',
        level: 'info',
        title: msg,
        content: { msg },
        usersPermissionsUser: data.user,
      }});
    } else if (data.type == 'project') {
      const role = await strapi.db.query('plugin::users-permissions.role')
        .findOne({where: { id: data.role }});
      const msg =
        'You have been assigned a project ' + role.name + ' permission';
      await strapi.db.query('api::message.message').create({data: {
        type: 'system',
        level: 'info',
        title: msg,
        content: { msg },
        usersPermissionsUser: data.user,
      }});
    }
  },
};  