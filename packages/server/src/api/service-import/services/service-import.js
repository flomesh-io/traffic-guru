'use strict';

/**
 * service-import service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::service-import.service-import', {
    async syncCreateSvcImports(reg) {
        strapi.log.debug('>>> syncCreateSvcImports...');
        // to fetch all sevice imports from k8s cluster
        const k8sAxios = await strapi.service('api::kubernetes.kubernetes').getK8sAxios(reg);
        const svcImportsUrl = '/apis/flomesh.io/v1alpha1/serviceimports';
        await k8sAxios.get(svcImportsUrl).then(async function (response) {
          // strapi.log.debug('  ------->>> response.data = ', response.data);
          const k8sSvcImports = response.data.items;
          const guruSvcImports = await strapi.db.query('api::service-import.service-import').findMany({where: {
            registry: {id: reg.id}
          }});
          for (let i = 0; i < k8sSvcImports.length; i++) {
            const itemInK8s = k8sSvcImports[i];
            const svcName = itemInK8s.metadata.name;
            const namespace = itemInK8s.metadata.namespace;
            // find out all related service-exports
            const serviceExports = [];
            const svcList = await strapi.db.query('api::service.service').findMany({where: {
              name: svcName,
              namespace: namespace
            }, populate: true});
            for (let j = 0; j < svcList.length; j++) {
                const svc = svcList[j];
                if(svc.serviceExport?.id && svc.registry.id !== reg.id) {
                  serviceExports.push(svc.serviceExport.id);
                }
            }
            // check if the itemInK8s is in traffic-guru system
            if (guruSvcImports.find((itemInGuru) => (itemInGuru.name == svcName && itemInGuru.namespace == namespace))) {
              strapi.log.debug('--- do update service-imports: serviceExports = ' + serviceExports);
              strapi.db.query('api::service-import.service-import').update({where: {
                name: svcName,
                namespace: namespace,
                registry: reg.id, 
              }, data: {
                serviceExports: serviceExports 
              }});
            } else if(serviceExports.length > 0) {
              strapi.log.debug('--- do create service-imports: serviceExports==> ' + serviceExports);
              // create this service-import
              strapi.db.query('api::service-import.service-import').create({data: {
                name: svcName,
                namespace: namespace,
                registry: reg.id,
                serviceExports: serviceExports
              }});
            } else {
              strapi.log.debug('--- Find an svc-import but the related svc-export is not in Guru!' );
            }

          }
        }).catch(function (error) {
           console.error(error)
        });
      },
    
      async syncDeleteSvcImports(reg) {
        strapi.log.debug('>>> syncDeleteSvcImports...');
        // to fetch all sevice imports from k8s cluster
        const k8sAxios = await strapi.service('api::kubernetes.kubernetes').getK8sAxios(reg);
        const svcImportsUrl = '/apis/flomesh.io/v1alpha1/serviceimports';
        await k8sAxios.get(svcImportsUrl).then(async function (response) {
          // strapi.log.debug('  ------->>> response.data = ', response.data);
          const k8sSvcImports = response.data.items;
          const guruSvcImports = await strapi.db.query('api::service-import.service-import').findMany({where: {
            registry: reg.id
          }});
          for (let i = 0; i < guruSvcImports.length; i++) {
            const itemInGuru = guruSvcImports[i];
            const svcName = itemInGuru.name;
            const namespace = itemInGuru.namespace;
            // find out all related service-exports
            const serviceExports = [];
            const svcList = await strapi.db.query('api::service.service').findMany({where: {
              name: svcName,
              namespace: namespace
            }, populate: true});
            for (let j = 0; j < svcList.length; j++) {
                const svc = svcList[j];
                if(svc.serviceExport?.id && svc.registry.id !== reg.id) {
                  serviceExports.push(svc.serviceExport.id);
                }
            }
            if(serviceExports.length === 0){ // delete the svcImport if there is no other svcExports
              strapi.log.debug('--- do delete service-imports');
              // delete this service-import
              strapi.db.query('api::service-import.service-import').delete({where: { id: itemInGuru.id }});
            } else if (k8sSvcImports.find((itemInK8s) => (svcName == itemInK8s.metadata.name && namespace == itemInK8s.metadata.namespace))) {
              // check if the itemInGuru is in k8s, if yes then do update
              strapi.log.debug('--- do update service-imports: ' + serviceExports);
              strapi.db.query('api::service-import.service-import').update({where: {
                id: itemInGuru.id 
              }, data: {
                serviceExports: serviceExports 
              }});
            } else {
              // it should be never run here!!!
              throw new Error('ErieCanal Error: please try to reExport serviceExports - ' + serviceExports);
            }
          }
        }).catch(function (error) {
          console.error(error);
        });
      },
    
      async createGlobalTrafficPolicy(svcImport) {
        strapi.log.debug('===>>> createGlobalTrafficPolicy');
        const k8sAxios = await strapi.service('api::kubernetes.kubernetes').getK8sAxios(svcImport.registry);
    
        const lbType = svcImport.content.type;
        const lbTargets = [];
        for (let index = 0; index < svcImport.serviceExports.length; index++) {
          const svcExport = svcImport.serviceExports[index];
          const exportTarget = svcImport.content.targets[svcExport.id];
          if(exportTarget?.enabled){
            // build lbTargets data
            if (lbType === 'ActiveActive') { // ActiveActive
              const target = {
                "clusterKey": svcExport.clusterKey,
                "weight": exportTarget.weight
              };
              lbTargets.push(target);
            } else { // Locality or FailOver
              const target = {
                "clusterKey": svcExport.clusterKey
              };
              lbTargets.push(target);
            }
          }
        }
    
        if(lbTargets.length===0){
          return;
        }
        
        const postData = {
          apiVersion: "flomesh.io/v1alpha1",
          kind: "GlobalTrafficPolicy",
          metadata: {
            namespace: svcImport.namespace,
            name: svcImport.name,
          },
          spec: {
            lbType: lbType,
            targets: lbTargets,
          },
        };
        strapi.log.debug("  --->>> trafficPolicyData = ", JSON.stringify(postData));
        const globalTrafficPolicyUrl = "/apis/flomesh.io/v1alpha1/namespaces/" + svcImport.namespace + "/globaltrafficpolicies";
        await k8sAxios.post(globalTrafficPolicyUrl, postData).then(function (response) {
          // strapi.log.debug("    ------->>> response.data = ", response.data);
          if (response.status >= 300) {
            throw new Error(response.data.reason);
          }
        }).catch(function (error) {
          console.error("  --->>> " + error);
        });
      },
    
      async deleteGlobalTrafficPolicy(svcImport) {
        strapi.log.debug('===>>> deleteGlobalTrafficPolicy');
        const k8sAxios = await strapi.service('api::kubernetes.kubernetes').getK8sAxios(svcImport.registry);
        const globalTrafficPolicyUrl = "/apis/flomesh.io/v1alpha1/namespaces/" + svcImport.namespace + "/globaltrafficpolicies/" + svcImport.name;
        await k8sAxios.delete(globalTrafficPolicyUrl).then(function (response) {
          // strapi.log.debug("   ------>>> response.data = ", response.data);
          if (response.status >= 300) {
            throw new Error(response.data.reason);
          }
        }).catch(function (error) { // just log the err
          console.error("ErieCanal " + error);
        });
      }
});
