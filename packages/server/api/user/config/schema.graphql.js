const _ = require('lodash');
function checkBadRequest(contextBody) {
  if (_.get(contextBody, 'statusCode', 200) !== 200) {
    const message = _.get(contextBody, 'error', 'Bad Request');
    const exception = new Error(message);
    exception.code = _.get(contextBody, 'statusCode', 400);
    exception.data = contextBody;
    throw exception;
  }
}

module.exports = {
  definition: `
    input UsersPermissionsLoginByCodeInput {
      identifier: String!
      password: String!
      verificationCode: String!
      provider: String = "local"
    }`,
  query: `
    getUser(id: String): UsersPermissionsUser!
    `,
  mutation: `
    loginByCode(input: UsersPermissionsLoginByCodeInput!): UsersPermissionsLoginPayload!
    changePasswordByCode(input: JSON): Boolean
    `,
  type: {},
  resolver: {
    Query: {
      getUser: {
        description: 'Return User',
        resolver: 'application::user.user.getUser',
      },
    },
    Mutation: {
      loginByCode: {
        resolverOf: 'plugins::users-permissions.auth.callback',
        resolver: async (obj, options, { context }) => {
          const emailConf = await strapi
            .query('system-setting')
            .findOne({ type: 'EmailConf' });
          let code = null;
          if (emailConf?.content?.service) {
            const date = new Date(
              new Date().getTime() - 5 * 60 * 1000
            ).toISOString();
            code = await strapi.query('verification-code').findOne({
              username: context.request.body.input.identifier,
              created_at_gt: date,
              _sort: 'created_at:desc',
            });
            if (!code) {
              code = await strapi.query('verification-code').findOne({
                email: context.request.body.input.identifier,
                created_at_gt: date,
                _sort: 'created_at:desc',
              });
            }
            strapi.log.info(code);
            if (
              !code ||
              code.code != context.request.body.input.verificationCode ||
              code.isUsed
            ) {
              throw new Error(
                'The verification code is incorrect or has expired'
              );
            }
          }

          context.params = {
            ...context.params,
            provider: options.input.provider,
          };
          context.request.body = _.toPlainObject(options.input);

          await strapi.plugins['users-permissions'].controllers.auth.callback(
            context
          );
          const output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;

          checkBadRequest(output);

          if (
            emailConf?.content?.service &&
            _.get(output, 'statusCode', 200) === 200
          ) {
            await strapi
              .query('verification-code')
              .update({ id: code.id }, { isUsed: true });
          }
          return {
            user: output.user || output,
            jwt: output.jwt,
          };
        },
      },

      changePasswordByCode: {
        description: 'Request a reset password token',
        resolverOf: 'plugins::users-permissions.auth.forgotPassword',
        resolver: async (obj, options, { context }) => {
          const emailConf = await strapi
            .query('system-setting')
            .findOne({ type: 'EmailConf' });
          if (emailConf?.content?.service) {
            const date = new Date(
              new Date().getTime() - 5 * 60 * 1000
            ).toISOString();
            let code = await strapi.query('verification-code').findOne({
              username: context.request.body.input.identifier,
              created_at_gt: date,
              _sort: 'created_at:desc',
            });
            if (!code) {
              code = await strapi.query('verification-code').findOne({
                email: context.request.body.input.identifier,
                created_at_gt: date,
                _sort: 'created_at:desc',
              });
            }
            if (
              !code ||
              code.code != context.request.body.input.verificationCode ||
              code.isUsed
            ) {
              throw new Error(
                'The verification code is incorrect or has expired'
              );
            } else {
              await strapi
                .query('verification-code')
                .update({ id: code.id }, { isUsed: true });
            }
          }

          const user = await strapi
            .query('user', 'users-permissions')
            .findOne({ email: context.request.body.input.email });
          if (!user) return false;
          const password = await strapi.plugins[
            'users-permissions'
          ].services.user.hashPassword({
            password: context.request.body.input.newPassword,
          });
          strapi.log.info(password);
          await strapi
            .query('user', 'users-permissions')
            .update({ id: user.id }, { password: password });

          return true;
        },
      },
      updateUser: {
        policies: ['global::userRegistryFilter'],
      },
      createUser: {
        policies: ['global::userRegistryFilter'],
      },
    },
  },
};
