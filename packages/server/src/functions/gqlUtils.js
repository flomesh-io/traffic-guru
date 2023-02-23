'use strict';

module.exports = {
    async transformArgs(args, contentType, usePagination) {
        const utils = strapi.plugin('graphql').service('builders').utils;
        const transformedArgs = utils.transformArgs(args, { contentType, usePagination: usePagination ? true : false })
        return transformedArgs
    },
};
