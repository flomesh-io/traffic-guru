'use strict';

module.exports = {
  async init() {
    await this.initPermissions();
    await this.initView();
  },
  async initPermissions() {
    const resource_permission = await strapi.db.query('api::resource-permission.resource-permission').findMany();
    if (resource_permission.length == 0) {
      await this.init_resource_permissions_free();
    } else if (
      resource_permission.length != 11 ||
      !resource_permission[0].type
    ) {
      await strapi.db.query('api::resource-permission.resource-permission').deleteMany();
      await this.init_resource_permissions_free();
    }
  },

  async initView() {
    // create view
    const knex = strapi.db.connection;
    let typeField = `'component.' || type AS type`;
    if (knex.schema.client.config.client == 'mysql') {
      typeField = 'CONCAT("component.", type) AS type';
    }

    try {
      await knex.schema.raw(`CREATE OR REPLACE VIEW components AS
    SELECT name,
          ${typeField},
          id AS target_id,
          created_at,
          updated_at,
          '' AS namespace,
          content,
          '' AS uid
      FROM fleets
    UNION ALL
    SELECT name,
          'service' AS type,
          id AS target_id,
          created_at,
          updated_at,
          namespace,
          content,
          uid
      FROM services
    UNION ALL
    SELECT ingresses.name,
          'ingress' AS type,
          ingresses.id AS target_id,
          ingresses.created_at,
          ingresses.updated_at,
          n.name as namespace,
          ingresses.content,
          ingresses.uid
      FROM ingresses
      left join ingresses_namespace_links l
      on l.ingress_id = ingresses.id
      left join namespaces n
      on n.id = l.namespace_id;`);
    } catch (error) {
      strapi.log.error(error);
    }
  },
  async init_resource_permissions_free() {
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'organization',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'registry',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'dashboard',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'fleet',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'widget',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'userspermissions',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'user',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'service',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'mesh',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'ingress',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});

    await strapi.db.query('api::resource-permission.resource-permission').create({data: {
      name: 'project',
      type: 'organization',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    }});
    return await strapi.db.query('api::resource-permission.resource-permission').findMany();
  },
};
