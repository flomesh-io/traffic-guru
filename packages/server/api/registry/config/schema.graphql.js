module.exports = {
  definition: `
    input RefreshRegistryInput {
      where: InputID
    }

    type RefreshRegistryPayload {
      registry: Registry
    }
   `,
  query: ` `,
  mutation: `
    pingRegistry(input: RegistryInput): JSON
    refreshRegistry(input: RefreshRegistryInput): RefreshRegistryPayload
  `,
  resolver: {
    Mutation: {
      pingRegistry: {
        resolver: 'application::registry.registry.ping',
      },
      refreshRegistry: {
        resolver: 'application::registry.registry.refresh',
      },
    },
  },
};
