const { sanitizeEntity } = require('strapi-utils');
module.exports = {
  definition: `
    type MessageConnections {
        values          : [Message]
        groupBy         : MessageGroupBy
        aggregate       : MessageAggregators
    }
    
    type MessageAggregators {
      totalCount          : Int
      count               : Int
    }`,
  query: `
      getMessages(sort:String, limit:Int, start: Int, where: JSON, publicationState: PublicationState): MessageConnections
    `,
  type: {},
  resolver: {
    Query: {
      getMessages: {
        resolverOf: 'application::Message.Message.find',
        resolver: async (obj, options, { context }) => {
          const entities = await strapi.controllers.message.find(context);

          const values = entities.map((entity) =>
            sanitizeEntity(entity, { model: strapi.models.message })
          );
          const count = await strapi.controllers.message.count(context);
          return { values, aggregate: { count, totalCount: count } };
        },
      },
    },
  },
};
