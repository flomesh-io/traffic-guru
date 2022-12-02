module.exports = {
  definition: `
    type Services {
      total   : Int!
      include : Int!
      exclude : Int!
    }
    type Registries {
      total    : Int!
      valid    : Int!
      invalid  : Int!
    }
    type FSMDashboardPageInfo {
      services         : Services!
      registries       : Registries!
    }
    `,
  query: `
    getFsmDashboardPageInfo(where: JSON): FSMDashboardPageInfo!
    `,
  resolver: {
    Query: {
      getFsmDashboardPageInfo: {
        description: 'Return k8s namespace',
        resolver:
          'application::fsmDashboard.fsmDashboard.getFsmDashboardPageInfo',
      },
    },
  },
};
