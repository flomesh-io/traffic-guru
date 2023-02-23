'use strict';
const initUtils = require("./functions/initUtils.js");
const loginUtils = require("./functions/loginUtils.js");
const initCommonUtils = require("./functions/initCommonUtils.js");
const entityUtils = require("./functions/entityUtils.js");
const gqlUtils = require("./functions/gqlUtils.js");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register ({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');
    const extension = () => ({
      // GraphQL SDL
      typeDefs: `
        input InputID {
          id: ID!
        }
        input RefreshRegistryInput {
          where: InputID
        }
        type RefreshRegistryPayload {
          registry: Registry
        }

        type LoadBalancerSummary {
          loadbalancer_amount         : Int!
          layer4_loadbalancer_amount  : Int!
          layer7_loadbalancer_amount  : Int!
          active_clients              : Int!
          active_targets              : Int!
        }
        type AddressPoolPerUsage {
          pool_id       : String!
          pool_name     : String!
          used_amount   : Int!
          amount        : Int!
        }
        type AddressPoolUsage {
          pool_usages       : [AddressPoolPerUsage]!
          total_used_amount : Int!
          total_amount      : Int!
        }
        type LoadBalancerTopItem {
          value : String!
          iid   : String!
          name  : String!
        }
        type LoadBalancerErrorRateItem {
          error_amount  : Int!
          total_amount  : Int!
          status        : Int!
        }
        type DashboardPageInfo {
          loadbalancer_summary                : LoadBalancerSummary!
          address_pool_usage                  : AddressPoolUsage!,
          layer7_loadbalancer_connections_top : [LoadBalancerTopItem]!,
          layer4_loadbalancer_connections_top : [LoadBalancerTopItem]!,
          layer7_loadbalancer_tps_top         : [LoadBalancerTopItem]!,
          layer4_loadbalancer_tps_top         : [LoadBalancerTopItem]!,
          layer7_loadbalancer_bps_top         : [LoadBalancerTopItem]!,
          layer4_loadbalancer_bps_top         : [LoadBalancerTopItem]!,
          layer7_loadbalancer_error_rate      : [LoadBalancerErrorRateItem]!,
        }

        type Services {
          total   : Int!
          include : Int!
          exclude : Int!
        }
        type Registries {
          total    : Int!
          valid    : Int!
          invalid  : Int!
        }
        type FSMDashboardPageInfo {
          services         : Services!
          registries       : Registries!
        }

        type Healthchecks {
          health     : Int!
          unhealthy  : Int!
        }
        type HealthcheckDashboardPageInfo {
          healthchecks_timer     : JSON!
          healthchecks  : Healthchecks!
        }

        type ResourcesAction {
          name:    String
          enabled: Boolean
        }
        type ResourcesPermission {
          name:    String
          actions: [ResourcesAction]
        }
        type RolePermission {
          name:        String
          description: String
          type:        String
          content:     String
          permissions: JSON
        }
        input RolePermissionInput {
          name:        String
          description: String
          type:        String
          content:     String
          permissions: JSON
        }

        input RouterSettingBatchInput {
          name: String
          path: String
          disabled: Boolean
          invisible: Boolean
          sort: Int
          level: Int
          fullPath: String
          displayName: String
          parent: ID
          children: [RouterSettingBatchInput]
          published_at: DateTime
          created_by: ID
          updated_by: ID
        }

        input UsersPermissionsLoginByCodeInput {
          identifier: String!
          password: String!
          verificationCode: String!
          provider: String = "local"
        }

        type Query {
          uniSearch(filters: JSON, pagination: PaginationArg = {}, sort: [String] = []): JSON

          getFsmDashboardPageInfo(filters: JSON): FSMDashboardPageInfo!

          getIngresses(filters: IngressFiltersInput,pagination: PaginationArg = {},sort: [String] = []): IngressEntityResponseCollection
          getIngress(id: ID): IngressEntityResponse

          myMessages(filters: MessageFiltersInput, pagination: PaginationArg = {}, sort: [String] = []): MessageEntityResponseCollection

          getOrganizationsTree: JSON
          myOrganizations(filters: OrganizationFiltersInput, pagination: PaginationArg = {}, sort: [String] = []): OrganizationEntityResponseCollection

          getRoleResourcePermission(type: String, id: ID): RolePermission

          getRolesConnection(filters:UsersPermissionsRoleFiltersInput,pagination: PaginationArg = {},sort: [String] = []): UsersPermissionsRoleEntityResponseCollection

          getServices(filters: ServiceFiltersInput,pagination: PaginationArg = {}, sort: [String] = []): ServiceEntityResponseCollection
          getAllServices(sort:String, limit:Int, start: Int, filters: JSON, publicationState: PublicationState): ServiceEntityResponseCollection
          getService(id: ID): ServiceEntityResponse

          getUser(id: ID): UsersPermissionsUserEntityResponse!

        }
        type Mutation {

          fetchIngresses: Boolean
          createIngressSync(data: IngressInput): Ingress
          updateIngressSync(id: ID!, data: IngressInput): IngressEntityResponse
          deleteIngressSync(data: IngressInput): Ingress

          createRoleResourcePermission(data: RolePermissionInput): Int
          updateRoleResourcePermission(id: ID!, data: RolePermissionInput): Int
    
          batchCreateRouterSetting(data: JSON ): JSON

          fetchServices: Boolean
          fetchAllServices: Boolean
          createServiceSync(data: ServiceInput): Service
          updateServiceSync(id: ID!, data: ServiceInput!): ServiceEntityResponse
          deleteServiceSync(data: ServiceInput): Service

          loginByCode(data: UsersPermissionsLoginByCodeInput!): UsersPermissionsLoginPayload!
          changePasswordByCode(data: JSON): Boolean

          pingRegistry(data: RegistryInput): JSON
          refreshRegistry(id: Int): Boolean
        }
      `,
      resolvers: {
        Query: {

          //  TODO
          uniSearch: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel("api::uni-component.uni-component"), true)
              const results = await strapi.service('api::uni-component.uni-component').getComponents(transformedArgs, ctx)
              return results
            },
          },

          getFsmDashboardPageInfo: {
            async resolve (obj, args, ctx) {
              const result = await strapi.service('api::fsm-dashboard.fsm-dashboard').getFsmDashboardPageInfo(args, ctx);
              return result;
            }
          },
          getIngresses: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::ingress.ingress'), false)
              const result = await strapi.controller('api::ingress.ingress').getIngresses(transformedArgs, ctx);
              return entityUtils.toEntityResponseCollection(transformedArgs, 'api::ingress.ingress', result);
            }
          },
          getIngress: {
            async resolve (obj, args) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::ingress.ingress'), false)
              const result = await strapi.service('api::ingress.ingress').getIngress(transformedArgs);
              return entityUtils.toEntityResponse(transformedArgs, 'api::ingress.ingress', result);
            }
          },

          myMessages: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::message.message'), true)
              const { results } = await strapi.service('api::message.message').myMessages(transformedArgs, ctx);
              return entityUtils.toEntityResponseCollection(transformedArgs, 'api::message.message', results);
            }
          },

          getOrganizationsTree: {
            async resolve (obj, args, ctx) {
              const results = await strapi.controller('api::organization.organization').getOrgsTree(args, ctx);
              return results
            },
          },
          myOrganizations: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel("api::organization.organization"), true)
              const results = await strapi.controller('api::organization.organization').myOrganizations(transformedArgs, ctx);
              return entityUtils.toEntityResponseCollection(transformedArgs, 'api::organization.organization', results)
            },
          },

          getRoleResourcePermission: {
            async resolve (obj, args, ctx) {
              const results = await strapi.service('api::resource-permission.resource-permission').getResourcePermission(args, ctx);
              return results
            }
          },

          getRolesConnection: {
            resolver: 'application::Role.Role.getRolesConnection',
          },

          getServices: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel("api::service.service"), true)
              const results = await strapi.service('api::service.service').getServices(ctx, transformedArgs);
              return entityUtils.toEntityResponseCollection(transformedArgs, 'api::service.service', results)
            },
          },
          getAllServices: {
            async resolve (obj, args) {
              const { results, pagination } = await strapi.service('api::service.service').getAllServices(args);
              return { data:{id:results.id,attributes:results}, meta:{pagination:pagination}};
            },
          },
          getService: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::service.service'), false)
              const result = await strapi.controller('api::service.service').getService(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::service.service', result);
            }
          },

          getUser: {
            async resolve (obj, args, ctx) {
              if (!args.id) {
                args.id = ctx.state.user.id
              }
              const results = await strapi.db.query('plugin::users-permissions.user').findOne({where: {id: args.id}, populate: true});
              return entityUtils.toEntityResponse(args, 'plugin::users-permissions.user', results)
            }
          },

        },
        Mutation: {
          
          fetchIngresses: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::ingress.ingress'), false)
              const result = await strapi.controller('api::ingress.ingress').fetchIngresses(transformedArgs, ctx);
              return result;
            }
          },
          updateIngressSync: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::ingress.ingress'))
              const result = await strapi.controller('api::ingress.ingress').updateIngressSync(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::ingress.ingress', result)
            },
          },
          deleteIngressSync: {
            resolver: 'application::Ingress.Ingress.deleteIngressSync',
          },
          createIngressSync: {
            resolver: 'application::Ingress.Ingress.create',
            async resolve (obj, args, ctx) {
              return await strapi.controllers.ingress.createIngressSync(ctx.context);
            },
          },

          createRoleResourcePermission: {
            async resolve (obj, args, ctx) {
              const results = await strapi.service('api::resource-permission.resource-permission').createRoleResourcePermission(args, ctx);
              return results
            }
          },
          updateRoleResourcePermission: {
            async resolve (obj, args, ctx) {
              const results = await strapi.service('api::resource-permission.resource-permission').updateRoleResourcePermission(args, ctx);
              return results
            }
          },

          batchCreateRouterSetting: {
            async resolve (obj, args, ctx) {
              const results = await strapi.controller('api::router-setting.router-setting').batchCreateRouterSetting(args, ctx);
              return results
            }
          },

          fetchServices: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel("api::service.service"), true)
              const results = await strapi.service('api::service.service').fetchServices(ctx, transformedArgs);
              return results
            }
          },
          fetchAllServices: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel("api::service.service"), true)
              const results = await strapi.service('api::service.service').fetchAllServices(transformedArgs, ctx);
              return results
            }
          },
          updateServiceSync: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::service.service'))
              const result = await strapi.controller('api::service.service').updateServiceSync(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::service.service', result)
            },
          },
          deleteServiceSync: {
            resolver: 'application::Service.Service.deleteServiceSync',
          },
          createServiceSync: {
            resolver: 'application::Service.Service.create',
          },

          loginByCode: {
            async resolve (obj, args, ctx) {
              return await loginUtils.loginByCode(obj, args, ctx);
            },
          },
          changePasswordByCode: {
            async resolve (obj, args) {
              const result = await strapi.service('api::user.user').changePasswordByCode(args);
              return result;
            },
          },

          pingRegistry: {
            async resolve (obj, args) {
              const result = await strapi.controller('api::registry.registry').ping(args);
              return result;
            },
          },
          refreshRegistry: {
            async resolve (obj, args, ctx) {
              const result = await strapi.controller('api::registry.registry').refresh(ctx, args);
              return result;
            },
          },
        }
      },
      resolversConfig: {
        'Query.myMessages': {
          auth: {
            scope: ['api::message.message.find']
          }
        },

        'Query.uniSearch': {
          scope: ['api::message.message.find']
        },
        'Mutation.loginByCode': {
          auth: false
        },
      },
    });
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap () {
    await initUtils.init();
    await initCommonUtils.init()


    //创建admin账户

    //创建配置项

    //创建插件
  },
};
