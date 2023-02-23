"use strict";

module.exports = {
  beforeCreate: (event) => strapi.service('api::resource.resource').make(event, 'ingress'),
  afterCreate: (event) => strapi.service('api::resource.resource').deploy(event),
  afterUpdate: (event) => strapi.service('api::resource.resource').deploy(event),
};  