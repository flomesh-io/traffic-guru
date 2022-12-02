const { sanitizeEntity } = require('strapi-utils');
module.exports = {
  definition: `
    type ProjectConnections {
        values          : [Project]
        groupBy         : ProjectGroupBy
        aggregate       : ProjectAggregators
    }
    
    type ProjectAggregators {
      totalCount          : Int
      count               : Int
    }
  `,
  query: `
    getProjects(sort:String, limit:Int, start: Int, where: JSON, publicationState: PublicationState): ProjectConnections
    myProjects(search: String, limit: Int, start: Int): ProjectConnections
    `,
  resolver: {
    Query: {
      getProjects: {
        resolverOf: 'application::Project.Project.find',
        resolver: async (obj, options, { context }) => {
          const entities = await strapi.controllers.project.find(context);

          const values = entities.map((entity) =>
            sanitizeEntity(entity, { model: strapi.models.project })
          );
          const count = await strapi.controllers.project.count(context);
          return { values, aggregate: { count, totalCount: count } };
        },
      },
      myProjects: {
        resolver: 'application::project.project.myProjects',
      },
    },
  },
};
