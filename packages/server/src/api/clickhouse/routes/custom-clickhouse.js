'use strict';

/**
 * clickhouse router
 */

module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'GET',
        path: '/clickhouse', 
        handler: 'clickhouse.proxy',
      }
    ]
  }
