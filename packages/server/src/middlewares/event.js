
module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        await next();
        try {
            const ip = ctx.req.connection.remoteAddress;

            if (ctx.request.url == "/graphql"
            || ctx.request.url.indexOf("/api/k8s") > -1
            || ctx.request.url.indexOf("/api/clickhouse") > -1
            || ctx.request.url.indexOf("/api/prometheus") > -1) {
              if (ctx.request.header["authorization"] && ctx.state?.user?.id) {
                let json = ""
                try {
                  json = ctx.request.body.query.replace(/\n/, '');
                } catch {
                }

                if (json.indexOf("logout") == -1) {
                  const user = await strapi.db.query("plugin::users-permissions.user").findOne({where:{id:ctx.state?.user?.id}})
                  if (!user || ctx.request.header["authorization"].indexOf(user.token) == -1) {
                    ctx.response.status = 401
                    ctx.response.body = {
                      "error": {
                        "data": null,
                        "error": {
                          "status": 401,
                          "name": "UnauthorizedError",
                          "message": "Token expired",
                          "details": {}
                        }
                      }
                    }
                }
                  
                  return
                }
              }
            }

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
                name = body.data[method[0]]?.data?.attributes?.name
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
                const login = body.data.login || body.data.loginByCode || body.data.loginNoCode
                user = login?.user?.id 
                await strapi.db.query("plugin::users-permissions.user").update({where:{id:user}, data: {token: login?.jwt}})
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
            console.error(error);
          }
      };
  };