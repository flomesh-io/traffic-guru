"use strict";

module.exports = {
  beforeUpdate: async (event) => {
    const data = event.params.data
    if (data.users) {
      const dbOrg = await strapi.db.query('api::project.project').findOne({where: event.params.where, populate: true});
      for (const newUser of data.users) {
        const dbUser = dbOrg.users.find((o) => o.id == newUser);
        if (!dbUser) {
          const msg = 'You are added to the project ' + dbOrg.name;
          await strapi.db.query('api::message.message').create({data: {
            type: 'system',
            level: 'info',
            title: msg,
            content: { msg },
            usersPermissionsUser: newUser,
          }});
        }
      }
    }
  },
};  