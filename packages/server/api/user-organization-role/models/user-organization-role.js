'use strict';

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.type == 'organization') {
        const role = await strapi
          .query('role', 'users-permissions')
          .findOne({ id: data.role });
        const msg =
          'You have been assigned an organization ' + role.name + ' permission';
        await strapi.query('message').create({
          type: 'system',
          level: 'info',
          title: msg,
          content: { msg },
          usersPermissionsUser: data.user,
        });
      } else if (data.type == 'project') {
        const role = await strapi
          .query('role', 'users-permissions')
          .findOne({ id: data.role });
        const msg =
          'You have been assigned a project ' + role.name + ' permission';
        await strapi.query('message').create({
          type: 'system',
          level: 'info',
          title: msg,
          content: { msg },
          usersPermissionsUser: data.user,
        });
      }
    },
  },
};
