'use strict';

/**
 * clickhouse router
 */

module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/prometheus', 
        handler: 'prometheus.proxy',
      },
      {
        method: 'GET',
        path: '/prometheus/mesh/:id', 
        handler: 'prometheus.proxymesh',
      },
      {
        method: 'GET',
        path: '/prometheus/namespace/:id', 
        handler: 'prometheus.proxynamespace',
      }
    ]
  }
