module.exports = {
  definition: `
  type RoleConnections {
    values          : [UsersPermissionsRole]
    groupBy         : UsersPermissionsRoleGroupBy
    aggregate       : RoleAggregators
}

type RoleAggregators {
  totalCount          : Int
  count               : Int
}
  `,
  query: `
    getRolesConnection(sort:String, limit:Int, start: Int, where: JSON, publicationState: PublicationState): RoleConnections
    `,
  mutation: `
    `,
  resolver: {
    Query: {
      getRolesConnection: {
        resolver: 'application::Role.Role.getRolesConnection',
      },
    },
  },
};
