'use strict';

module.exports = {
  routes: [
    {
      "method": "POST",
      "path": "/registries/ping",
      "handler": "registry.ping",
      "config": {
        "policies": []
      }
    }
  ]
}
  
