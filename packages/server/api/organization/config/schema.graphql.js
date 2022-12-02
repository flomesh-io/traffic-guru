module.exports = {
  definition: ` 
    type OrgConnections {
      values          : [Organization]
      aggregate       : OrgAggregators
    }
    type OrgAggregators {
      totalCount          : Int
      count               : Int
    }
  `,
  query: `
    getOrganizationsTree: JSON
    myOrganizations(search: String): [Organization]
  `,
  mutation: ` `,
  resolver: {
    Query: {
      getOrganizationsTree: {
        resolver: 'application::organization.organization.getOrgsTree',
      },
      myOrganizations: {
        resolver: 'application::organization.organization.myOrganizations',
      },
    },
  },
};
