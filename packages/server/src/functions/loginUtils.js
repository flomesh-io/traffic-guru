'use strict';
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
  async loginByCode (obj, args, context) {
    const emailConf = await strapi.db
      .query('api::system-setting.system-setting')
      .findOne({ type: 'EmailConf' });
    let code = null;
    if (emailConf?.content?.service) {
      const date = new Date(
        new Date().getTime() - 5 * 60 * 1000
      ).toISOString();
      code = await strapi.db.query('api::verification-code.verification-code').findOne({
        username: args.identifier,
        created_at_gt: date,
        _sort: 'created_at:desc',
      });
      if (!code) {
        code = await strapi.db.query('api::verification-code.verification-code').findOne({
          email: args.identifier,
          created_at_gt: date,
          _sort: 'created_at:desc',
        });
      }
      strapi.log.info(code);
      if (
        !code ||
        code.code != args.verificationCode ||
        code.isUsed
      ) {
        throw new Error(
          'The verification code is incorrect or has expired'
        );
      }
    }

    context.params = {
      ...context.params,
      provider: args.data.provider,
    };
    context.koaContext.request.body = _.toPlainObject(args.data);

    await strapi.plugins['users-permissions'].controllers.auth.callback(context);
    const output = context.body.toJSON
      ? context.body.toJSON()
      : context.body;

    checkBadRequest(output);

    if (
      emailConf?.content?.service &&
      _.get(output, 'statusCode', 200) === 200
    ) {
      await strapi.db
        .query('api::verification-code.verification-code')
        .update({ id: code.id }, { isUsed: true });
    }
    return {
      user: output.user || output,
      jwt: output.jwt,
    };
  },
};
