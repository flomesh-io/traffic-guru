'use strict';

module.exports = {
  async toEntityResponseCollection(args, resourceUID, nodes) {
    let start = 1
    let limit = 10
    if (args?.pagination?.page) {
      start = (args.pagination.page - 1) * args.pagination.pageSize
      limit = args.pagination.pageSize
    } else if (args?.pagination?.start) {
      start = args.pagination.start
      limit = args.pagination.limit
    }
    return { nodes, info: { args: { ...args, sort:args.sort, start, limit }, resourceUID } }
  },
  async toEntityResponse(args, resourceUID, value) {
    return { value, info: { args, resourceUID } }
  },
};
