module.exports = {
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: true,
      depthLimit: 7,
      amountLimit: 300,
      generateArtifacts: true,
      artifacts: {schema: true, typegen: true},
      apolloServer: {
        tracing: false,
      }
    },
  },
};