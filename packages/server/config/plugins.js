module.exports = {
  graphql: {
    endpoint: '/graphql',
    shadowCRUD: true,
    playgroundAlways: false,
    depthLimit: 7,
    amountLimit: 1000,
    apolloServer: {
      tracing: false,
    },
  },
};
