'use strict';

/**
 * clickhouse router
 */

module.exports = {
    routes: [
      {
        "method": "GET",
        "path": "/website/download/:id",
        "handler": "website.download",
      },
    ]
  }
