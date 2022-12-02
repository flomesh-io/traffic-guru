'use strict';

module.exports = {
  lifecycles: {
    beforeCreate: async (params) => {
      const sameOrg = await strapi
        .query('organization')
        .findOne({ name: params.name, parent: params.parent });
      if (sameOrg) {
        throw new Error('The organization name cannot be duplicated');
      }
    },
    beforeUpdate: async (params, data) => {
      if (params.name) {
        const sameOrg = await strapi
          .query('organization')
          .findOne({ name: params.name, parent: params.parent });
        if (sameOrg) {
          throw new Error('The organization name cannot be duplicated');
        }
      }

      if (data.users) {
        const dbOrg = await strapi
          .query('organization')
          .findOne({ id: params.id });
        for (const newUser of data.users) {
          const dbUser = dbOrg.users.find((o) => o.id == newUser);
          if (!dbUser) {
            const msg = 'You are added to the organization ' + dbOrg.name;
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

      try {
        const dbOrg = await strapi
          .query('organization')
          .findOne({ id: params.id });
        for (const user of dbOrg.users) {
          const has = data.users.find((u) => u == user.id);
          if (!has) {
            await strapi.query('user-organization-role').delete({
              user: user.id,
              organization: params.id,
              type: 'organization',
            });
            const projects = await strapi
              .query('project')
              .find({ id_in: dbOrg.projects.map((o) => o.id) });
            for (const project of projects) {
              const users = project.users.filter((e) => e.id != user.id);
              await strapi
                .query('project')
                .update({ id: project.id }, { users });
              await strapi.query('user-organization-role').delete({
                user: user.id,
                organization: project.id,
                type: 'project',
              });
            }
            break;
          }
        }
      } catch (error) {
        strapi.log.error(error);
      }
    },
  },
};
