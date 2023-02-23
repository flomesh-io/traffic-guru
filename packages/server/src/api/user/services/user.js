'use strict';

/**
 * upstream service
 */
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user.user',{
  async changePasswordByCode (obj, args) {
    const emailConf = await strapi.db
      .query('system-setting')
      .findOne({ type: 'EmailConf' });
    if (emailConf?.content?.service) {
      const date = new Date(
        new Date().getTime() - 5 * 60 * 1000
      ).toISOString();
      let code = await strapi.db.query('verification-code').findOne({
        username: args.data.identifier,
        created_at_gt: date,
        _sort: 'created_at:desc',
      });
      if (!code) {
        code = await strapi.query('verification-code').findOne({
          email: args.data.identifier,
          created_at_gt: date,
          _sort: 'created_at:desc',
        });
      }
      if (
        !code ||
        code.code != args.data.verificationCode ||
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

    const user = await strapi.db.query('plugin::users-permissions.user')
      .findOne({ email: args.data.email });
    if (!user) return false;
    const password = await strapi.plugins[
      'users-permissions'
    ].services.user.hashPassword({
      password: args.data.newPassword,
    });
    strapi.log.info(password);
    await strapi.db
      .query('plugin::users-permissions.user')
      .update({ id: user.id }, { password: password });

    return true;
  },
});
