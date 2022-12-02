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

module.exports = {
  definition: ``,
  query: ``,
  mutation: `
    generateVerificationCode(identifier: String): JSON
    `,
  resolver: {
    Query: {},
    Mutation: {
      generateVerificationCode: {
        resolverOf: 'plugins::users-permissions.auth.connect',
        resolver: async (obj, options, { context }) => {
          let user = await strapi
            .query('user', 'users-permissions')
            .findOne({ username: context.request.body?.identifier });
          if (!user) {
            user = await strapi
              .query('user', 'users-permissions')
              .findOne({ email: context.request.body?.identifier });
          }
          if (!user) {
            throw new Error(`The user does not exist`);
          }

          const min = 100000;
          const max = 999999;
          const range = max - min;
          const random = Math.random();
          const verificationCode = min + Math.round(random * range);
          const html = template({
            verificationCode: verificationCode,
          });
          await strapi.config.functions.emailUtils.send(
            user.email,
            'Flomesh verification code',
            html
          );
          await strapi.query('verification-code').create({
            username: user.username,
            email: user.email,
            code: verificationCode,
            isUsed: false,
          });
          return { timeout: 300, email: user.email };
        },
      },
    },
  },
};
