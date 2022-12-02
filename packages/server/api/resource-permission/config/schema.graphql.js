module.exports = {
  definition: `

    type ResourcesAction {
      name:    String
      enabled: Boolean
    }
    type ResourcesPermission {
      name:    String
      actions: [ResourcesAction]
    }
    type RolePermission {
      id:          ID
      name:        String
      description: String
      type:        String
      content:     String
      resources:   [ResourcesPermission]
    }

    `,
  query: `
    getRoleResourcePermission(type: String, roleId: ID): RolePermission!
    `,
  mutation: `
        createRoleResourcePermission(input: JSON): Int
        updateRoleResourcePermission(roleId: ID!, input: JSON): Int
        deleteRoleResourcePermission(roleId: ID!): Int
    `,
  resolver: {
    Query: {
      getRoleResourcePermission: {
        resolver:
          'application::resource-permission.resource-permission.getResourcePermission',
      },
    },
    Mutation: {
      createRoleResourcePermission: {
        resolver:
          'application::resource-permission.resource-permission.createRoleResourcePermission',
      },
      updateRoleResourcePermission: {
        resolver:
          'application::resource-permission.resource-permission.updateRoleResourcePermission',
      },
      deleteRoleResourcePermission: {
        resolver:
          'application::resource-permission.resource-permission.deleteRoleResourcePermission',
      },
    },
  },
};
