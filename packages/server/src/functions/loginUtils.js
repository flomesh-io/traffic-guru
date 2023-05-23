'use strict';
const _ = require('lodash');
const { getOr } = require('lodash/fp');
const { toPlainObject } = require('lodash/fp');
const emailUtils = require('./emailUtils.js');
const encryptUtil = require('./encryptUtil.js');

const content = `
<div style='background-color: #f2f2f2;padding: 15px;'>
  <div style='background-color: #ffffff;padding: 30px;box-shadow: rgba(122, 55, 55, 0.2) 0px 1px 1px 0px;'>
    <h2>Flomesh verification code: <%= verificationCode%></h2><br>

    <br><br><br>此致<br>
    <b>Flomesh Admin</b>
    <br><br><small>【此邮件为系统自动发送，请勿回复。】</small>
  </div>
</div>
`;
const ejs = require('ejs');
const template = ejs.compile(content);

function checkBadRequest(contextBody) {
  const statusCode = getOr(200, 'statusCode', contextBody);

  if (statusCode !== 200) {
    const errorMessage = getOr('Bad Request', 'error', contextBody);

    const exception = new Error(errorMessage);

    exception.code = statusCode || 400;
    exception.data = contextBody;

    throw exception;
  }
}

async function checkCode(identifier, verificationCode) {
  const emailConf = await strapi.db
    .query('api::system-setting.system-setting')
    .findOne({ where: { type: 'EmailConf' } });
  let code = null;
  if (emailConf?.content?.service) {
    const date = new Date(new Date().getTime() - 5 * 60 * 1000).toISOString();
    code = await strapi.db
      .query('api::verification-code.verification-code')
      .findOne({where: {
        username: identifier,
        createdAt: {$gt: date},
      }, orderBy: {createdAt: "desc"}});
    if (!code) {
      code = await strapi.db
        .query('api::verification-code.verification-code')
        .findOne({where: {
          email: identifier,
          createdAt: {$gt: date},
        }, orderBy: {createdAt: "desc"}});
    }
    if (!code || code.code != verificationCode || code.isUsed) {
      throw new Error('The verification code is incorrect or has expired');
    }
  } else {
    throw new Error("You have not configure your email in SystemSetting!")
  }
  return {emailConf, code}
} 

module.exports = {
  async loginByCode(obj, args, context) {
    args.input.password = encryptUtil.decrypt(args.input.password)
    const {emailConf, code} = await checkCode(args.input.identifier, args.input.verificationCode);

    const { koaContext } = context;

    koaContext.params = { provider: args.input.provider };
    koaContext.request.body = toPlainObject(args.input);

    await strapi
      .plugin('users-permissions')
      .controller('auth')
      .callback(koaContext);

    const output = koaContext.body;

    checkBadRequest(output);

    if (
      emailConf?.content?.service &&
      _.get(output, 'statusCode', 200) === 200
    ) {
      await strapi.db
        .query('api::verification-code.verification-code')
        .update({ where: { id: code.id }, data: { isUsed: true } });
    }

    return {
      user: output.user || output,
      jwt: output.jwt,
    };
  },

  async registerByCode(obj, args, context) {
    const {emailConf, code} = await checkCode(args.input.email, args.input.verificationCode);

    args.input.password = encryptUtil.decrypt(args.input.password)

    const { koaContext } = context;

    koaContext.request.body = toPlainObject(args.input);

    await strapi
      .plugin('users-permissions')
      .controller('auth')
      .register(koaContext);

    const output = koaContext.body;

    checkBadRequest(output);

    if (
      emailConf?.content?.service && 
      _.get(output, 'statusCode', 200) === 200
    ) {
      await strapi.db
        .query('api::verification-code.verification-code')
        .update({ where: { id: code.id }, data: { isUsed: true } });
    }

    if (output.user.id && output.jwt) {
      await strapi.db.query("plugin::users-permissions.user").update({where:{id:output.user.id}, data: {token: output.jwt}})
    }
    
    return {
      user: output.user || output,
      jwt: output.jwt,
    };
  },
  async generateVerificationCode(obj, args) {

    const min = 100000;
    const max = 999999;
    const range = max - min;
    const random = Math.random();
    const verificationCode = min + Math.round(random * range);
    const html = template({
      verificationCode: verificationCode,
    });
    let user = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({where: { username: args.identifier }});
    if (!user) {
      user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({where: { email: args.identifier }});
    }
    const email = user ? user.email : args.identifier
    const lastCode = await strapi.db.query('api::verification-code.verification-code').findOne({where:{email}, orderBy: {createdAt: "desc"}}) 
    if (lastCode && !lastCode.isUsed) {
      if ((new Date().getTime() - (29 * 1000)) < new Date(lastCode.createdAt).getTime()) {
        throw new Error("Unable to generate verification code, please try again later")
      }
    }
    await emailUtils.send(email, 'Flomesh verification code', html);
    await strapi.db.query('api::verification-code.verification-code').create({
      data: {
        username: user?.username,
        email: email,
        code: verificationCode,
        isUsed: false,
      },
    });
    return { timeout: 300, email };
  },

  async changePasswordByCode (obj, args) {
    const emailConf = await strapi.db
      .query('api::system-setting.system-setting')
      .findOne({where: { type: 'EmailConf' }});
    args.data.newPassword = encryptUtil.decrypt(args.data.newPassword)
    if (emailConf?.content?.service) {
      const date = new Date(
        new Date().getTime() - 5 * 60 * 1000
      ).toISOString();
      let code = await strapi.db.query('api::verification-code.verification-code').findOne({where: {
        username: args.data.email,
        createdAt: {$gt: date},
      }, orderBy: {createdAt: "desc"}});
      if (!code) {
        code = await strapi.db.query('api::verification-code.verification-code').findOne({where: {
          email: args.data.email,
          createdAt: {$gt: date},
        }, orderBy: {createdAt: "desc"}});
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
        await strapi.db
        .query('api::verification-code.verification-code')
          .update({where: { id: code.id }, data: { isUsed: true }});
      }
    }

    const user = await strapi.db.query('plugin::users-permissions.user')
      .findOne({where: { email: args.data.email }});
    if (!user) return false;
    
    const password = await strapi.service(`admin::auth`).hashPassword(args.data.newPassword);
    await strapi.db
      .query('plugin::users-permissions.user')
      .update({where: { id: user.id }, data: { password: password }});

    return true;
  },

  //==================
  async loginNoCode(obj, args, context) {
    args.input.password = encryptUtil.decrypt(args.input.password)
    
    const { koaContext } = context;

    koaContext.params = { provider: args.input.provider };
    koaContext.request.body = toPlainObject(args.input);

    await strapi
      .plugin('users-permissions')
      .controller('auth')
      .callback(koaContext);

    const output = koaContext.body;

    checkBadRequest(output);

    return {
      user: output.user || output,
      jwt: output.jwt,
    };
  },

  async registerNoCode(obj, args, context) {
    args.input.password = encryptUtil.decrypt(args.input.password)

    const { koaContext } = context;

    koaContext.request.body = toPlainObject(args.input);

    await strapi
      .plugin('users-permissions')
      .controller('auth')
      .register(koaContext);

    const output = koaContext.body;

    checkBadRequest(output);

    if (output.user.id && output.jwt) {
      await strapi.db.query("plugin::users-permissions.user").update({where:{id:output.user.id}, data: {token: output.jwt}})
    }

    return {
      user: output.user || output,
      jwt: output.jwt,
    };
  },
  async changePasswordNoCode (obj, args, context) {

    args.data.newPassword = encryptUtil.decrypt(args.data.newPassword)
    args.data.currentPassword = encryptUtil.decrypt(args.data.currentPassword)


    const { koaContext } = context;

    koaContext.params = { provider: "local" };
    koaContext.request.body = toPlainObject({identifier: args.data.email, password: args.data.currentPassword});

    try {
      await strapi
        .plugin('users-permissions')
        .controller('auth')
        .callback(koaContext);
  
      const output = koaContext.body;
      checkBadRequest(output);

      const password = await strapi.service(`admin::auth`).hashPassword(args.data.newPassword);
      await strapi.db
        .query('plugin::users-permissions.user')
        .update({where: { id: output.user.id }, data: { password: password }});
    } catch (e){
      console.log(e)
      throw new Error("The old password is incorrect")
    }

    return true;
  },
};
