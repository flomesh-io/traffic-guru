'use strict';

const gqlUtils = require('./gqlUtils.js');
const entityUtils = require("./entityUtils.js");

module.exports = {
  async myOrgResources(args, ctx, type, isMultiple) {
    const model = 'api::' + type + '.' + type;
    const transformedArgs = await gqlUtils.transformArgs(
      args,
      strapi.getModel(model),
      true
    );
    if (ctx.state.user.role.id != 1) {
      const organizations = await strapi.db
        .query('api::organization.organization')
        .findMany({
          where: { users: ctx.state.user.id },
          populate: true,
        });
      const ids = organizations.map((item) => item.id);
      if (!transformedArgs.filters) transformedArgs.filters = {};
      if (isMultiple) {
        if (!transformedArgs.filters.organizations) transformedArgs.filters.organizations = {};
        transformedArgs.filters.organizations.id = { $in: ids };
      } else {
        if (!transformedArgs.filters.organization) transformedArgs.filters.organization = {};
        transformedArgs.filters.organization.id = { $in: ids };
      }
    }
    const results = strapi.entityService.findMany(model,transformedArgs);
    console.log(transformedArgs)
    return entityUtils.toEntityResponseCollection(
      transformedArgs,
      model,
      results
    );
  },
};
