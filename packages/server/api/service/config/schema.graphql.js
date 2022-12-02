module.exports = {
  definition: `
      type ServiceConnections {
          values          : [Service]
          groupBy         : ServiceGroupBy
          aggregate       : ServiceAggregators
      }
      
      type ServiceAggregators {
        totalCount          : Int
        count               : Int
    }
  `,
  query: `
        getServices(sort:String, limit:Int, start: Int, where: JSON, publicationState: PublicationState): ServiceConnections
        getAllServices(sort:String, limit:Int, start: Int, where: JSON, publicationState: PublicationState): ServiceConnections
        getService(id: ID!, publicationState: PublicationState): Service
    `,
  mutation: `
        fetchServices: Boolean
        fetchAllServices: Boolean
        createServiceSync(input: createServiceInput): Service
        updateServiceSync(input: updateServiceInput): Service
        deleteServiceSync(input: deleteServiceInput): Service
    `,
  resolver: {
    Query: {
      getServices: {
        resolver: 'application::service.service.getServices',
      },
      getAllServices: {
        resolver: 'application::service.service.getAllServices',
      },
      getService: {
        resolver: 'application::service.service.getService',
      },
    },
    Mutation: {
      fetchServices: {
        policies: [],
        resolver: 'application::service.service.fetchServices',
      },
      fetchAllServices: {
        policies: [],
        resolver: 'application::service.service.fetchAllServices',
      },
      updateServiceSync: {
        policies: [],
        resolver: 'application::Service.Service.updateServiceSync',
      },
      deleteServiceSync: {
        policies: [],
        resolver: 'application::Service.Service.deleteServiceSync',
      },

      createServiceSync: {
        resolverOf: 'application::Service.Service.create',
        resolver: async ({ context }) => {
          return await strapi.controllers.service.createServiceSync(context);
        },
      },
    },
  },
};
