
module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        await next();
        try {
            if (
              ctx.request.body.query &&
              ctx.request.body.query.indexOf('mutation') > -1
            ) {
              const reg = /(?<={).*?(?=\()/;
              const json = ctx.request.body.query.replace(/\n/, '');
              const method = json.match(reg);
              const ip = ctx.req.connection.remoteAddress;
              if (method && method[0] && ctx.state?.user?.id) {
                await strapi.db.query('api::event.event').create({data: {
                  user: ctx.state.user.id,
                  loginIp: ip,
                  action: method && method[0].trim(),
                  content: json,
                }});
              }
            }
          } catch (error) {
            strapi.log.error(error);
          }
      };
  };