module.exports = {
  definition: `
      type IngressConnections {
          values          : [Ingress]
          groupBy         : IngressGroupBy
          aggregate       : IngressAggregators
      }
      
      type IngressAggregators {
        totalCount          : Int
        count               : Int
    }
  `,
  query: `
        getIngresses(sort:String, limit:Int, start: Int, where: JSON, publicationState: PublicationState): IngressConnections
        getIngress(id: ID!, publicationState: PublicationState): Ingress
    `,
  mutation: `
        fetchIngresses: Boolean
        createIngressSync(input: createIngressInput): Ingress
        updateIngressSync(input: updateIngressInput): Ingress
        deleteIngressSync(input: deleteIngressInput): Ingress
    `,
  resolver: {
    Query: {
      getIngresses: {
        resolver: 'application::Ingress.Ingress.getIngresses',
      },
      getIngress: {
        resolver: 'application::Ingress.Ingress.getIngress',
      },
    },
    Mutation: {
      fetchIngresses: {
        policies: [],
        resolver: 'application::Ingress.Ingress.fetchIngresses',
      },
      updateIngressSync: {
        policies: [],
        resolver: 'application::Ingress.Ingress.updateIngressSync',
      },
      deleteIngressSync: {
        policies: [],
        resolver: 'application::Ingress.Ingress.deleteIngressSync',
      },

      createIngressSync: {
        resolverOf: 'application::Ingress.Ingress.create',
        resolver: async (obj, options, { context }) => {
          return await strapi.controllers.ingress.createIngressSync(context);
        },
      },
    },
  },
};
