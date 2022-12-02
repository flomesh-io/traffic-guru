module.exports = {
  definition: ``,
  query: `
    getWidgets: [Widget]
    `,
  type: {},
  resolver: {
    Query: {
      getWidgets: {
        description: 'Return Widgets',
        resolver: 'application::widget.widget.getWidgets',
      },
    },
    Mutation: {
      createWidget: {
        resolverOf: 'application::Widget.Widget.create',
        resolver: async (obj, options, { context }) => {
          context.request.body.user_id = context.state.user.id.toString();

          return await strapi.controllers.widget.create(context);
        },
      },
    },
  },
};
