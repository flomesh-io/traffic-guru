module.exports = (strapi) => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        await next();
        try {
          if (
            ctx.request.body.query &&
            ctx.request.body.query.indexOf('mutation') > -1
          ) {
            const user = await strapi.plugins[
              'users-permissions'
            ].services.user.fetch();
            const reg = /(?<={).*?(?=\()/;
            const json = ctx.request.body.query.replace(/\n/, '');
            const method = json.match(reg);
            const ip = ctx.req.connection.remoteAddress;
            if (method && method[0]) {
              await strapi.query('event').create({
                user: user,
                loginIp: ip,
                action: method && method[0].trim(),
                content: json,
              });
            }
          }
        } catch (error) {
          strapi.log.error(error);
        }
      });
    },
  };
};
