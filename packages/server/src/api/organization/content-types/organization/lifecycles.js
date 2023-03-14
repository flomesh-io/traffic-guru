"use strict";

module.exports = {
  beforeCreate: async ({ params }) => {
    const sameOrg = await strapi.db
      .query('api::organization.organization')
      .findOne({
        where: {
          name: params.data.name,
        }
      });
    if (sameOrg) {
      throw new Error('The organization name cannot be duplicated');
    }
  },
  beforeUpdate: async (params, data) => {
    if (params.name) {
      const sameOrg = await strapi.db
        .query('api::organization.organization')
        .findOne({
          where: {
            name: params.name,
            parent: params.parent
          }
        });
      if (sameOrg) {
        throw new Error('The organization name cannot be duplicated');
      }
    }

    if (data && data.users) {
      const dbOrg = await strapi.db
        .query('api::organization.organization')
        .findOne({
          where: { id: params.id }
        });
      for (const newUser of data.users) {
        const dbUser = dbOrg.users.find((o) => o.id == newUser);
        if (!dbUser) {
          const msg = 'You are added to the organization ' + dbOrg.name;
          await strapi.db.query('api::message.message').create({where: {
            type: 'system',
            level: 'info',
            title: msg,
            content: { msg },
            usersPermissionsUser: newUser,
          }});
        }
      }
    }

    try {
      const dbOrg = await strapi.db
        .query('api::organization.organization')
        .findOne({
          where: { id: params.id }
        });
      for (const user of dbOrg.users) {
        const has = data.users.find((u) => u == user.id);
        if (!has) {
          await strapi.db.query('api::user-organization-role.user-organization-role').delete({where: {
            user: user.id,
            organization: params.id,
            type: 'organization',
          }});
          const projects = await strapi.db
            .query('api::project.project')
            .find({where: { id: {$in: dbOrg.projects.map((o) => o.id)} }});
          for (const project of projects) {
            const users = project.users.filter((e) => e.id != user.id);
            await strapi.db
              .query('api::project.project')
              .update({where: { id: project.id }, data: { users }});
            await strapi.db.query('api::user-organization-role.user-organization-role').delete({where: {
              user: user.id,
              organization: project.id,
              type: 'project',
            }});
          }
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};  