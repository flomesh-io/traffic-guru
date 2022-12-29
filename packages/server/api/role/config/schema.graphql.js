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
    getRoles(sort:String, limit:Int, start: Int, where: JSON, publicationState: PublicationState): [UsersPermissionsRole]
    `,
  mutation: `
    `,
  resolver: {
    Query: {
      getRolesConnection: {
        resolver: 'application::Role.Role.getRolesConnection',
      },
      getRoles: {
        resolver: 'application::Role.Role.getRoles',
      },
    },
  },
};
