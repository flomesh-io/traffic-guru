'use strict';

module.exports = {
  async init() {
    await this.initPermissions();
    await this.initView();
  },
  async initPermissions() {
    let resource_permission = await strapi.query('resource-permission').find();
    if (resource_permission.length == 0) {
      resource_permission = await this.init_resource_permissions_free();
    } else if (
      resource_permission.length != 11 ||
      !resource_permission[0].type
    ) {
      await strapi.query('resource-permission').delete();
      resource_permission = await this.init_resource_permissions_free();
    }
  },

  async initView() {
    // create view
    const knex = strapi.connections[strapi.config.database.defaultConnection];
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
      left join namespaces n
      on n.id = ingresses.namespace;`);
    } catch (error) {
      strapi.log.error(error);
    }
  },
  async init_resource_permissions_free() {
    await strapi.query('resource-permission').create({
      name: 'organization',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'registry',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'dashboard',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'fleet',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'widget',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'userspermissions',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'user',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'service',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'mesh',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    await strapi.query('resource-permission').create({
      name: 'ingress',
      type: 'system',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });

    await strapi.query('resource-permission').create({
      name: 'project',
      type: 'organization',
      content: { actions: ['find', 'create', 'update', 'delete'] },
    });
    return await strapi.query('resource-permission').find();
  },
};
