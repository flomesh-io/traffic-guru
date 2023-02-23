'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const k8s = require('@kubernetes/client-node');

module.exports = createCoreService('api::certificate.certificate',{
    // TODO 该方法未调用
    async getBindingCertificates(ctx) {
      return await strapi
        .query('certificates')
        .find({ services: ctx.query._serviceid });
    },
    // TODO 该方法未调用
    async bindingCertificate(ctx) {
      const dbData = await strapi
        .query('certificates')
        .findOne({ id: ctx.request.body.certificateid });
      if (!dbData.content) {
        dbData.content = {};
      }
      if (!dbData.content.services) {
        dbData.content.services = [];
      }
      dbData.content.services.push({
        service: ctx.request.body.serviceid,
        start: ctx.request.body.start,
        end: ctx.request.body.end,
      });
      dbData.services.push({ id: ctx.request.body.serviceid });
  
      await strapi
        .query('certificates')
        .update({ id: ctx.request.body.certificateid }, dbData);
  
      return await strapi
        .query('certificates')
        .find({ services: ctx.request.body.serviceid });
    },
    // TODO 该方法未调用
    async unbindCertificate(ctx) {
      const dbData = await strapi
        .query('certificates')
        .findOne({ id: ctx.request.body.certificateid });
      if (!dbData.content) {
        dbData.content = {};
      }
      if (!dbData.content.services) {
        dbData.content.services = [];
      }
  
      dbData.content.services = dbData.content.services.filter((a) => {
        return a.service != ctx.request.body.serviceid;
      });
      dbData.services = dbData.services.filter((a) => {
        return a.id != ctx.request.body.serviceid;
      });
  
      await strapi
        .query('certificates')
        .update({ id: ctx.request.body.certificateid }, dbData);
  
      return ctx.request.body.certificateid;
    },
    
    async syncK8s(event) {
      const data = event.params.data
      if (data.type != 'k8s') return;
  
      try {
        const ns = await strapi.db.query('api::namespace.namespace').findOne({where: {id: event.params.data.namespace}, populate: true});
        const kc = await strapi.service('api::kubernetes.kubernetes').getKubeConfig(
          ns.registry.id,
          'k8s'
        );
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  
        let k8sHas = false;
        await k8sApi.readNamespacedSecret(data.name, ns.name);
        k8sHas = true;
  
        const body = {
          apiVersion: 'v1',
          kind: 'Secret',
          metadata: {
            name: data.name,
            namespace: ns.name,
          },
          data: {
            'tls.crt': data.content.cert,
            'tls.key': data.content.key,
          },
          type: 'kubernetes.io/tls',
        };
        if (k8sHas) {
          await k8sApi.replaceNamespacedSecret(data.name, ns.name, body);
        } else {
          await k8sApi.createNamespacedSecret(ns.name, body);
        }
      } catch {
      }
    },
});
