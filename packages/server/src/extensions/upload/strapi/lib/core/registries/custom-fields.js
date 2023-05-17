'use strict';

const { has } = require('lodash/fp');

const ALLOWED_TYPES = [
  'biginteger',
  'boolean',
  'date',
  'datetime',
  'decimal',
  'email',
  'enumeration',
  'float',
  'integer',
  'json',
  'password',
  'richtext',
  'string',
  'text',
  'time',
  'uid',
];

const customFieldsRegistry = (strapi) => {
  const customFields = {};

  return {
    getAll() {
      return customFields;
    },
    get(customField) {
      const registeredCustomField = customFields[customField];
      if (!registeredCustomField) {
        throw new Error(`Could not find Custom Field: ${customField}`);
      }

      return registeredCustomField;
    },
    add(customField) {
      const customFieldList = Array.isArray(customField) ? customField : [customField];

      for (const cf of customFieldList) {
        if (!has('name', cf) || !has('type', cf)) {
          throw new Error(`Custom fields require a 'name' and 'type' key`);
        }

        const { name, plugin, type } = cf;
        if (!ALLOWED_TYPES.includes(type)) {
          throw new Error(
            `Custom field type: '${type}' is not a valid Strapi type or it can't be used with a Custom Field`
          );
        }

        const isValidObjectKey = /^(?![0-9])[a-zA-Z0-9$_-]+$/g;
        if (!isValidObjectKey.test(name)) {
          throw new Error(`Custom field name: '${name}' is not a valid object key`);
        }

        // When no plugin is specified, or it isn't found in Strapi, default to global
        const uid = strapi.plugin(plugin) ? `plugin::${plugin}.${name}` : `global::${name}`;

        if (has(uid, customFields)) {
          throw new Error(`Custom field: '${uid}' has already been registered`);
        }

        customFields[uid] = cf;
      }
    },
  };
};

module.exports = customFieldsRegistry;
