module.exports = {
  definition: `
    `,
  query: `
    uniSearch(where: JSON, limit: Int, start: Int, sort: String): JSON!
    `,
  resolver: {
    Query: {
      uniSearch: {
        resolver: 'application::components.components.getComponents',
      },
    },
  },
};
