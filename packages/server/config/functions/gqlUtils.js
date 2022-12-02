'use strict';

module.exports = {
  async setConnectionParam(connectionQueryName, options, ctx) {
    switch (connectionQueryName) {
      case 'messagesConnection':
        options.where.usersPermissionsUser = ctx.context.state.user.id;
        break;

      default:
        break;
    }
  },
};
