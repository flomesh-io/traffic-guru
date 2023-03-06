'use strict';

/**
 * trafficlog router
 */

module.exports = {
  //
  routes: [
    { 
      method: 'POST',
      path: '/log4pipy/querylogs', 
      handler: 'trafficlog.querylogs',
    },
    { 
      method: 'POST',
      path: '/log4pipy/querysvclogs', 
      handler: 'trafficlog.querysvclogs',
    },
    { 
      method: 'POST',
      path: '/log4pipy/countlatency', 
      handler: 'trafficlog.countlatency',
    },
    { 
      method: 'POST',
      path: '/log4pipy/countstatus', 
      handler: 'trafficlog.countstatus',
    },
    { 
      method: 'POST',
      path: '/log4pipy/counttps', 
      handler: 'trafficlog.counttps',
    },
    { 
      method: 'POST',
      path: '/log4pipy/totaltps', 
      handler: 'trafficlog.totaltps',
    }
  ]

}