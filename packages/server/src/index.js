'use strict';
const initUtils = require("./functions/initUtils.js");
const loginUtils = require("./functions/loginUtils.js");
const initCommonUtils = require("./functions/initCommonUtils.js");
const entityUtils = require("./functions/entityUtils.js");
const gqlUtils = require("./functions/gqlUtils.js");
const resourceUtils = require("./functions/resourceUtils.js");
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
        type HealthCheckUnhealthy {
          unhealthy  : [String]!
          time       : DateTime!
        }
        type DashboardPageInfo {
          loadbalancer_summary                : LoadBalancerSummary!
          address_pool_usage                  : AddressPoolUsage!,
          health_check_unhealthy              : [HealthCheckUnhealthy]!,
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
        input UsersPermissionsLoginNoCodeInput {
          identifier: String!
          password: String!
          provider: String = "local"
        }
        input UsersPermissionsRegisterByCodeInput {
          username: String!
          email: String!
          password: String!
          verificationCode: String!
        }
        input UsersPermissionsRegisterNoCodeInput {
          username: String!
          email: String!
          password: String!
        }
        type ApiStatus {
          run     : Int!
          error   : Int!
        }
        type Apis {
          total   : Int!
          run     : Int!
          error   : Int!
        }
        type Applications {
          total   : Int!
          run     : Int!
          error   : Int!
        }
        type ApiDashboardPageInfo {
          apis           : Apis
          applications   : Applications
          api_status     : ApiStatus
          api_week       : JSON
          api_month      : JSON
        }

        type LatencyChartVO {
          latency : Int
          count   : Int
        }
        type StatusChartVO {
          status  : Int
          count   : Int
        }
        type TpsChartVO {
          minute : String
          count     : Int
        }
        type LatencyChartVOList {
          data : [LatencyChartVO]
        }
        type StatusChartVOList {
          data : [StatusChartVO]
        }
        type TpsChartVOList {
          data : [TpsChartVO]
        }
        type LogVOList {
          data : [LogVO]
          total: Int
        }
        type LogVO {
          serviceName : String
          podName     : String
          reqPath     : String
          reqMethod   : String
          reqProtocol : String
          resTime     : String
          reqTime     : String
          resStatus   : Int
          resSize     : String
          remoteAddr  : String
          remotePort  : Int
          localAddr   : String
          localPort   : Int
          createdAt   : String
          reqHeaders  : JSON
          message     : JSON
        }
        input LogFilters {
          serviceName  : String
          queryWords   : String
          a4lbid       : Int
          a7lbid       : Int
          aid          : Int
          appid        : Int
          igid         : Int
          meshName     : String
          customQuery  : String
          orderByField : String
          orderByType  : String
          reqTimeFrom  : DateTime
          reqTimeTo    : DateTime
          pageSize     : Int
          pageNo       : Int
        }
        input TraceFilters {
          keyWord      : String
          reqTimeFrom  : DateTime
          reqTimeTo    : DateTime
          pageSize     : Int
          pageNo       : Int
        }
        type TraceVO {
          traceId     : String
          spanCount   : String
          duration    : String
          minReqTime  : String
          maxResTime  : String
          serviceName : [String]
          podName     : [String]
        }
        type TraceVOList {
          data : [TraceVO]
          total: Int
        }
        type TraceSpanVO {
          traceSpan   : String
          traceParent : String
          serviceName : String
          podName     : String
          duration    : String
          reqTime     : String
          resTime     : String
          message     : JSON
        }
        type TraceDetailVO {
          data : [TraceSpanVO]
          rows : Int
        }
        input TraceDAGFilters {
          reqTimeFrom  : DateTime
          reqTimeTo    : DateTime
          meshName     : String
        }
        type TraceDAGRegistryVO {
          id   : Int
          name : String
        }
        type TraceDAGServiceVO {
          id        : Int
          name      : String
          pods      : [String]
          namespace : String
          registry  : TraceDAGRegistryVO
        }
        type TraceDAGLinkVO {
          error  : Boolean
          weight : String
          source : Int
          target : Int
        }
        type TraceDAGVO {
          services : [TraceDAGServiceVO]
          links    : [TraceDAGLinkVO]
        }

        type Query {
          uniSearch(filters: JSON, pagination: PaginationArg = {}, sort: [String] = []): JSON

          getFlbDashboardPageInfo(filters: JSON): DashboardPageInfo!
          getFsmDashboardPageInfo(filters: JSON): FSMDashboardPageInfo!
          getApiDashboardPageInfo(filters: JSON): ApiDashboardPageInfo!
          getHealthcheckDashboardPageInfo(filters: JSON): HealthcheckDashboardPageInfo

          getIngresses(filters: IngressFiltersInput,pagination: PaginationArg = {},sort: [String] = []): IngressEntityResponseCollection
          getIngress(id: ID): IngressEntityResponse


          getOrganizationsTree: JSON

          getRoleResourcePermission(type: String, id: ID): RolePermission

          getRolesConnection(filters:UsersPermissionsRoleFiltersInput,pagination: PaginationArg = {},sort: [String] = []): UsersPermissionsRoleEntityResponseCollection

          getServices(filters: ServiceFiltersInput,pagination: PaginationArg = {}, sort: [String] = []): ServiceEntityResponseCollection
          getAllServices(sort:String, limit:Int, start: Int, filters: JSON, publicationState: PublicationState): ServiceEntityResponseCollection
          getService(id: ID): ServiceEntityResponse

          getUser(id: ID): UsersPermissionsUserEntityResponse!

          getInitialized: Boolean!

          myOrganizations(filters: OrganizationFiltersInput, pagination: PaginationArg = {}, sort: [String] = []): OrganizationEntityResponseCollection
          myMessages(filters: MessageFiltersInput, pagination: PaginationArg = {}, sort: [String] = []): MessageEntityResponseCollection
          myFleets(filters: FleetFiltersInput, pagination: PaginationArg = {}, sort: [String] = []): FleetEntityResponseCollection
          
          logList(filters: LogFilters): LogVOList
          latencyChart(filters: LogFilters): LatencyChartVOList
          statusChart(filters: LogFilters): StatusChartVOList
          tpsChart(filters: LogFilters): TpsChartVOList

          traceList(filters: TraceFilters): TraceVOList
          traceDetail(traceId: String!): TraceDetailVO
          traceDAG(filters: TraceDAGFilters): TraceDAGVO

          websiteDownload(id: Int!, os: String!): String
        }
        type Mutation {


          createRoleResourcePermission(data: RolePermissionInput): Int
          updateRoleResourcePermission(id: ID!, data: RolePermissionInput): Int
          deleteRoleResourcePermission(id: ID!): Int
    
          batchCreateRouterSetting(data: JSON ): JSON

          fetchIngresses: Boolean
          createIngressSync(data: IngressInput!): IngressEntityResponse
          updateIngressSync(id: ID!, data: IngressInput): IngressEntityResponse
          deleteIngressSync(id: ID!): IngressEntityResponse

          fetchServices: Boolean
          fetchAllServices: Boolean
          createServiceSync(data: ServiceInput!): ServiceEntityResponse
          updateServiceSync(id: ID!, data: ServiceInput!): ServiceEntityResponse
          deleteServiceSync(id: ID!): ServiceEntityResponse

          loginByCode(input: UsersPermissionsLoginByCodeInput!): UsersPermissionsLoginPayload!
          registerByCode(input: UsersPermissionsRegisterByCodeInput!): UsersPermissionsLoginPayload!
          changePasswordByCode(data: JSON!): Boolean
          generateVerificationCode(identifier: String): JSON

          loginNoCode(input: UsersPermissionsLoginNoCodeInput!): UsersPermissionsLoginPayload!
          registerNoCode(input: UsersPermissionsRegisterNoCodeInput!): UsersPermissionsLoginPayload!
          changePasswordNoCode(data: JSON!): Boolean

          logout: Boolean

          pingRegistry(data: RegistryInput): JSON
          refreshRegistry(id: Int): Boolean

        }

        
      `,
      resolvers: {
        Query: {

          uniSearch: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel("api::uni-component.uni-component"), true)
              const results = await strapi.service('api::uni-component.uni-component').getComponents(transformedArgs, ctx)
              return results
            },
          },
          
          getFlbDashboardPageInfo: {
            async resolve (obj, args, ctx) {
              const result = await strapi.service('api::flb-dashboard.flb-dashboard').getFlbDashboardPageInfo(args, ctx);
              return result;
            }
          },
          getFsmDashboardPageInfo: {
            async resolve (obj, args, ctx) {
              const result = await strapi.service('api::fsm-dashboard.fsm-dashboard').getFsmDashboardPageInfo(args, ctx);
              return result;
            }
          },
          getApiDashboardPageInfo: {
            async resolve (obj, args, ctx) {
              const result = await strapi.service('api::api-dashboard.api-dashboard').getApiDashboardPageInfo(args, ctx);
              return result;
            }
          },
          getHealthcheckDashboardPageInfo: {
            async resolve (obj, args, ctx) {
              const result = await strapi.service('api::healthcheck.healthcheck').getHealthcheckDashboardPageInfo(args, ctx);
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

          getOrganizationsTree: {
            async resolve (obj, args, ctx) {
              const results = await strapi.controller('api::organization.organization').getOrgsTree(args, ctx);
              return results
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
          getInitialized: {
            async resolve () {
              const results = await strapi.db.query('plugin::users-permissions.user').count();
              return results > 0 ? true : false
            }
          },

          myMessages: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::message.message'), true)
              const results = await strapi.service('api::message.message').myMessages(transformedArgs, ctx);
              return entityUtils.toEntityResponseCollection(transformedArgs, 'api::message.message', results);
            }
          },

          myOrganizations: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel("api::organization.organization"), true)
              const results = await strapi.controller('api::organization.organization').myOrganizations(transformedArgs, ctx);
              return entityUtils.toEntityResponseCollection(transformedArgs, 'api::organization.organization', results)
            },
          },

          myFleets: {
            async resolve (obj, args, ctx) {
              return await resourceUtils.myOrgResources(args, ctx, "fleet", true);
            }
          },

          logList: {
            async resolve (obj, args, ctx) {
              ctx.request = { body: args.filters };
              return await strapi.controller('api::trafficlog.trafficlog').querylogs(ctx);
            }
          },
          latencyChart: {
            async resolve (obj, args, ctx) {
              ctx.request = { body: args.filters };
              return await strapi.controller('api::trafficlog.trafficlog').countlatency(ctx);
            }
          },
          statusChart: {
            async resolve (obj, args, ctx) {
              ctx.request = { body: args.filters };
              return await strapi.controller('api::trafficlog.trafficlog').countstatus(ctx);
            }
          },
          tpsChart: {
            async resolve (obj, args, ctx) {
              ctx.request = { body: args.filters };
              return await strapi.controller('api::trafficlog.trafficlog').counttps(ctx);
            }
          },
          traceList: {
            async resolve (obj, args, ctx) {
              ctx.request = { body: args.filters };
              return await strapi.controller('api::trafficlog.trafficlog').traceList(ctx);
            }
          },
          traceDetail: {
            async resolve (obj, args, ctx) {
              ctx.request = { body: args };
              return await strapi.controller('api::trafficlog.trafficlog').traceDetail(ctx);
            }
          },
          traceDAG: {
            async resolve (obj, args, ctx) {
              ctx.request = { body: args.filters };
              return await strapi.controller('api::trafficlog.trafficlog').traceDag(ctx);
            }
          },
          
          websiteDownload: {
            async resolve (obj, args, ctx) {
              return await strapi.controller('api::website.website').download(args, ctx);
            }
          },
        },
        Mutation: {

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
          deleteRoleResourcePermission: {
            async resolve (obj, args, ctx) {
              const results = await strapi.service('api::resource-permission.resource-permission').deleteRoleResourcePermission(args, ctx);
              return results
            }
          },

          batchCreateRouterSetting: {
            async resolve (obj, args, ctx) {
              const results = await strapi.controller('api::router-setting.router-setting').batchCreateRouterSetting(args, ctx);
              return results
            }
          },

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
              const result = await strapi.service('api::ingress.ingress').updateIngressSync(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::ingress.ingress', result)
            },
          },
          deleteIngressSync: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::ingress.ingress'))
              const result = await strapi.service('api::ingress.ingress').deleteIngressSync(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::ingress.ingress', result)
            },
          },
          createIngressSync: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::ingress.ingress'))
              const result = await strapi.service('api::ingress.ingress').createIngressSync(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::ingress.ingress', result)
            },
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
              const result = await strapi.service('api::service.service').updateServiceSync(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::service.service', result)
            },
          },
          deleteServiceSync: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::service.service'))
              const result = await strapi.service('api::service.service').deleteServiceSync(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::service.service', result)
            },
          },
          createServiceSync: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::service.service'))
              const result = await strapi.service('api::service.service').createServiceSync(transformedArgs, ctx);
              return entityUtils.toEntityResponse(transformedArgs, 'api::service.service', result)
            },
          },

          loginByCode: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('plugin::users-permissions.user'))
              return await loginUtils.loginByCode(obj, transformedArgs, ctx);
            },
          },
          registerByCode: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('plugin::users-permissions.user'))
              return await loginUtils.registerByCode(obj, transformedArgs, ctx);
            },
          },
          changePasswordByCode: {
            async resolve (obj, args) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('plugin::users-permissions.user'))
              const result = await loginUtils.changePasswordByCode(obj, transformedArgs);
              return result;
            },
          },
          loginNoCode: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('plugin::users-permissions.user'))
              return await loginUtils.loginNoCode(obj, transformedArgs, ctx);
            },
          },
          registerNoCode: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('plugin::users-permissions.user'))
              return await loginUtils.registerNoCode(obj, transformedArgs, ctx);
            },
          },
          changePasswordNoCode: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('plugin::users-permissions.user'))
              const result = await loginUtils.changePasswordNoCode(obj, transformedArgs, ctx);
              return result;
            },
          },
          logout: {
            async resolve (obj, args, ctx) {
              if (ctx.state?.user?.id) {
                await strapi.db.query("plugin::users-permissions.user").update({where: {id: ctx.state?.user?.id}, data: {token: null}})
              } else {
                return false;
              }
              return true;
            },
          },
          generateVerificationCode: {
            async resolve (obj, args) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('plugin::users-permissions.user'))
              const result = await loginUtils.generateVerificationCode(obj, transformedArgs);
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
          createYaml: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::yaml.yaml'))
              args.data.user = ctx.state.user.id;
              const result = await strapi.db.query("api::yaml.yaml").create(args)
              return entityUtils.toEntityResponse(transformedArgs, 'api::yaml.yaml', result)
            },
          },
          createKubectl: {
            async resolve (obj, args, ctx) {
              const transformedArgs = await gqlUtils.transformArgs(args, strapi.getModel('api::kubectl.kubectl'))
              args.data.user = ctx.state.user.id;
              const result = await strapi.db.query("api::kubectl.kubectl").create(args)
              return entityUtils.toEntityResponse(transformedArgs, 'api::kubectl.kubectl', result)
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
        'Query.getInitialized': {
          auth: false
        },
        'Mutation.loginByCode': {
          auth: false
        },
        'Mutation.changePasswordByCode': {
          auth: false
        },
        'Mutation.registerByCode': {
          auth: false
        },
        'Mutation.generateVerificationCode': {
          auth: false
        },
        'Mutation.loginNoCode': {
          auth: false
        },
        'Mutation.changePasswordNoCode': {
          auth: false
        },
        'Mutation.registerNoCode': {
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
