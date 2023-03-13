
module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        await next();
        try {
            const ip = ctx.req.connection.remoteAddress;
            if (
              ctx.request.body?.query &&
              ctx.request.body?.query?.indexOf('mutation') > -1
            ) {
              const reg = /(?<={).*?(?=\()/;
              const json = ctx.request.body.query.replace(/\n/, '');

              let data = null;
              if (ctx.request.body.variables?.data) {
                data = ctx.request.body.variables?.data;
              }

              const method = json.match(reg);
              let name = null;
              const organization = null;
              if (ctx.request.body.variables?.data?.name) {
                name = ctx.request.body.variables?.data?.name;
              } else if (method && method[0].indexOf("delete") > -1) {
                //console.log(ctx.response.body)
                const body = JSON.parse(ctx.response.body)
                name = body.data[method[0]].data.attributes.name
                //organization = body.data[method[0]].data.attributes.organization.data.attributes.id
              }

              if (method && method[0] && ctx.state?.user?.id) {
                await strapi.db.query('api::event.event').create({data: {
                  user: ctx.state.user.id,
                  loginIp: ip,
                  action: method && method[0].trim(),
                  content: json,
                  data,
                  name,
                  organization,
                  from: "GUI"
                }});
              }
            } else if (ctx.request.body?.identifier) {
              const body = JSON.parse(ctx.response.body)
              let status = "Success"
              let user = null;
              if (body.errors) {
                status = "Failure"
              } else {
                user = body.data.login.user.id
              }
              await strapi.db.query('api::event.event').create({data: {
              user: user,
              loginIp: ip,
              action: "Login" + status,
              name: ctx.request.body.identifier,
              content: "login",
              from: "GUI"
            }});
            }
          } catch (error) {
            strapi.log.error(error);
          }
      };
  };