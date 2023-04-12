'use strict';

/**
 * prometheus service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const axios = require('axios');

module.exports = createCoreService('api::prometheus.prometheus', {
    async proxy(ctx) {
        let fleet = await strapi.db.query('api::fleet.fleet').findOne({where: { type: 'prometheus', apply: true }});
        if (fleet == null) {
          fleet = await strapi.db.query('api::fleet.fleet').findOne({where: { type: 'prometheus' }});
          if (fleet == null) {
            ctx.response.status = 404;
            ctx.response.message = 'Please add prometheus to the component first';
            return;
          }
        }
    
        const host = fleet.content.host;
        const method = ctx.request.method ? 'GET' : ctx.request.method;
    
        const type = ctx.query.type;
    
        delete ctx.query.type;
        const queryStr = new URLSearchParams(ctx.query).toString();
    
        let url = `${host}/api/v1/${type}`;
        url = url.replace("//api/v1", "/api/v1")
        if (queryStr) {
          url = `${url}?${queryStr}`;
        }
        strapi.log.info(url)
        try {
          const response = await axios({
            method: method,
            url: url,
            timeout: 3000
          });
      
          ctx.response.status = response.status;
          ctx.response.body = response.data;
        } catch (error) {
          ctx.response.status = 504;
          ctx.response.message = "Unable to connect to prometheus: " + error.message;
        }
      },
    
      async proxymesh(ctx) {
        const queryStr = new URLSearchParams(ctx.query).toString();
    
        const mesh = await strapi.db.query('api::mesh.mesh').findOne({where: { id: ctx.params.id }, populate: true});
    
        if (!mesh || !mesh.prometheus) return;
    
        const type = ctx.query.type;
        delete ctx.query.type;
    
        let host = mesh.prometheus.content.host;
        if (host.substr(host.length - 1, 1) != '/') {
          host = host + '/';
        }
        const method = ctx.request.method ? 'GET' : ctx.request.method;
        let url = `${host}api/v1/${type}`;
        if (queryStr) {
          url = `${url}?${queryStr}`;
        }
        try {
          const response = await axios({
            method: method,
            url: url,
            timeout: 3000
          });
      
          ctx.response.status = response.status;
          ctx.response.body = response.data;
        } catch (error) {
          ctx.response.status = 504;
          ctx.response.message = "Unable to connect to prometheus: " + error.message;
        }
      },
      async proxynamespace(ctx) {
        const ns = await strapi.db.query('api::namespace.namespace').findOne({where: { id: ctx.params.id }});
        if (!ns || !ns.bindMesh) return;
    
        const queryStr = new URLSearchParams(ctx.query).toString();
    
        const type = ctx.query.type;
        delete ctx.query.type;
    
        const prometheus = await strapi
          .query('fleet')
          .findOne({ id: ns.bindMesh.prometheus });
        let host = prometheus.content.host;
        if (host.substr(host.length - 1, 1) != '/') {
          host = host + '/';
        }
    
        const method = ctx.request.method ? 'GET' : ctx.request.method;
        let url = `${host}api/v1/${type}`;
        if (queryStr) {
          url = `${url}?${queryStr}`;
        }
        try {
          const response = await axios({
            method: method,
            url: url,
            timeout: 3000
          });
      
          ctx.response.status = response.status;
          ctx.response.body = response.data;
        } catch (error) {
          ctx.response.status = 504;
          ctx.response.message = "Unable to connect to prometheus: " + error.message;
        }
      },
});
