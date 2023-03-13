'use strict';

/**
 * message service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::message.message',{
    async myMessages (args) {
        return await strapi.entityService.findMany('api::message.message',args);
    },
});
