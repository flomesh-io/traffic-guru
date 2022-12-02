'use strict';

module.exports = {
  lifecycles: {
    beforeUpdate: async (params, data) => {
      if (data.users) {
        const dbOrg = await strapi.query('project').findOne({ id: params.id });
        for (const newUser of data.users) {
          const dbUser = dbOrg.users.find((o) => o.id == newUser);
          if (!dbUser) {
            const msg = 'You are added to the project ' + dbOrg.name;
            await strapi.query('message').create({
              type: 'system',
              level: 'info',
              title: msg,
              content: { msg },
              usersPermissionsUser: newUser,
            });
          }
        }
      }
    },
  },
};
