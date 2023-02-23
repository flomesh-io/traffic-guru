'use strict';

/**
 * clickhouse router
 */

module.exports = {
    routes: [
      {
        "method": "GET",
        "path": "/k8s/:type",
        "handler": "kubernetes.getK8sItems",
      },
      {
        "method": "GET",
        "path": "/k8s/:type/:namespace",
        "handler": "kubernetes.getK8sItems",
      },
      {
        "method": "GET",
        "path": "/k8s/:type/:namespace/:name",
        "handler": "kubernetes.getK8sItem",
      },
      {
        "method": "GET",
        "path": "/k8s/:type/:namespace/:name/event",
        "handler": "kubernetes.getK8sEvent",
      },
      {
        "method": "GET",
        "path": "/k8s/pod/:namespace/:name/:container/log",
        "handler": "kubernetes.getK8sLogs",
      }
    ]
  }
