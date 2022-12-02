<template>
  <a-card
    class="card nopd"
    :loading="loading"
  >
    <template #title>
      {{ title ? title : $t("Services") }}
    </template>
    <template #extra>
      <div v-if="embed">
        <slot name="extra" />
      </div>
      <div v-if="hasSearch">
        <a-input-search
          v-model:value="key"
          @search="search()"
          class="right-search-input"
          :placeholder="$t('search')"
        />
        <a-divider
          v-if="!embed"
          type="vertical"
          v-permission="['service:create']"
        />
        <a-button
          v-if="!embed"
          type="link"
          shape="circle"
          @click="newItem"
          v-permission="['service:create']"
        >
          <template
            #icon
          >
            <PlusCircleTwoTone
              class="font-20 icon-menu-sm rotate-icon"
            />
          </template>
        </a-button>
        <a-divider
          v-if="!embed"
          type="vertical"
          v-permission="['service:create']"
        />
        <SyncBar
          v-if="!embed"
          :percent="syncLoading"
          @sync="sync(true)"
          v-permission="['service:create']"
        />
        <a-divider
          v-if="!embed"
          type="vertical"
        />
        <EnvSelector v-if="!embed" />
      </div>
    </template>
    <div>
      <a-table
        :pagination="
          embed && embedServices
            ? null
            : {
              showSizeChanger: false,
              showQuickJumper: false,
              onShowSizeChange: search,
              onChange: search,
              current: pageNo,
              pageSize: pageSize,
              showTotal: (total, range) => `${$t('Total')} ${total}`,
              total: total,
            }
        "
        :columns="dataColumns"
        :data-source="embed && embedServices ? embedList : list"
        class="bg-white"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 't'">
            <div>
              <a-tooltip
                placement="topLeft"
                :title="record.t"
              >
                <a href="javascript:void(0)">
                  <svg
                    class="icon table-icon"
                    aria-hidden="true"
                  >
                    <use
                      :xlink:href="$REST.KUBE.iconStatus[record.t]"
                    />
                  </svg>
                </a>
              </a-tooltip>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'gatewayPath'">
            <div>
              <a-input
                :placeholder="$t('unset')"
                v-model:value="record.gatewayPath"
                class="width-200"
                @blur="updateGatewayPath(record)"
              />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'name'">
            <div>
              <a
                href="javascript:void(0)"
                @click="detail(record.id, record.namespace)"
              >{{ record.name }}</a>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'labels'">
            <div v-if="record.labels">
              <a-tag
                :key="index"
                v-for="(labelkey, index) in Object.keys(record.labels)"
                :closable="false"
              >
                {{ labelkey }}:{{ record.labels[labelkey] }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'internalEndpointStr'">
            <div>
              <div v-html="record.internalEndpointStr" />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'externalEndpointStr'">
            <div>
              <div v-html="record.externalEndpointStr" />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div v-if="mode == 'ACL'">
              <a-tooltip
                :title="$t('Add to the whitelist')"
                @click="addWhitelist(record)"
              >
                <a><CheckCircleOutlined class="font-20 success" /></a>
              </a-tooltip>
              <a-tooltip
                :title="$t('Add to the blacklist')"
                @click="addBlacklist(record)"
              >
                <a class="ml-15"><StopOutlined class="danger font-20" /></a>
              </a-tooltip>
            </div>
            <div v-else>
              <a-dropdown v-if="!embed">
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a
                        v-permission="['service:update']"
                        @click="detail(record.id, record.namespace)"
                      >{{ $t("edit") }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm
                        placement="topLeft"
                        :ok-text="$t('Yes')"
                        :cancel-text="$t('No')"
                        @confirm="remove(record.id)"
                      >
                        <template #title>
                          <p>{{ $t("Tip") }}</p>
                          <p>{{ $t("Are you sure to delete this?") }}</p>
                        </template>
                        <a v-permission="['service:delete']">{{
                          $t("delete")
                        }}</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a><MoreOutlined /></a>
              </a-dropdown>
              <span v-else>&nbsp;-</span>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import {
  MoreOutlined,
  CheckCircleOutlined,
  StopOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons-vue";
import EnvSelector from "@/components/menu/EnvSelector";
import SyncBar from "@/components/tool/SyncBar";
const shortcolumns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Organization",
    width: 130,
    dataIndex: "organizationName",
  },
  {
    key: "registry",
    dataIndex: "registryName",
  },
  {
    key: "Namespace",
    width: 130,
    dataIndex: "namespace",
  },
  {
    key: "Gateway path",
    dataIndex: "gatewayPath",
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
const short2columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Organization",
    width: 330,
    dataIndex: "organizationName",
  },
  {
    key: "Registry",
    width: 330,
    dataIndex: "registryName",
  },
  {
    key: "Namespace",
    width: 330,
    dataIndex: "namespace",
  },
];
const short3columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Registry",
    width: 330,
    dataIndex: "registryName",
  },
  {
    key: "Namespace",
    width: 330,
    dataIndex: "namespace",
  },
  {
    key: "Labels",
    width: 280,
    dataIndex: "labels",
  },
];
const columns = [
  {
    key: " ", 
    dataIndex: "t",
  },
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Organization",
    width: 130,
    dataIndex: "organizationName",
  },
  {
    key: "Namespace",
    width: 130,
    dataIndex: "namespace",
  },
  {
    key: "Registry",
    dataIndex: "registryName",
  },
  {
    key: "Labels",
    width: 280,
    dataIndex: "labels",
  },
  {
    key: "Internal Endpoint",
    dataIndex: "internalEndpointStr",
  },
  {
    key: "External Endpoint",
    dataIndex: "externalEndpointStr",
  },
  {
    key: "updTime",
    dataIndex: "creationTimestamp",
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
export default {
  name: "ServiceList",
  components: {
    MoreOutlined,
    CheckCircleOutlined,
    StopOutlined,
    SyncBar,
    PlusCircleTwoTone,
    EnvSelector,
  },

  props: [
    "title",
    "hasSearch",
    "namespaces",
    "mode",
    "embedServices",
    "embed",
    "whitelistServices",
    "blacklistServices",
  ],

  i18n: require("@/i18n"),
  data() {
    return {
      key: "",
      syncLoading: -1,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      columns,
      shortcolumns,
      short2columns,
      short3columns,
      loading: true,
      list: [],
    };
  },

  computed: {
    embedList() {
      return this.reset(
        this.embedServices?.filter((s) => s.name.indexOf(this.key) > -1),
      );
    },

    start(){
      return (this.pageNo - 1) * this.pageSize;
    },

    dataColumns() {
      if (this.mode == "Subscribe Service") {
        return this.short2columns.map((column) => {
          column.title = this.$t(column.key);
          return column;
        });
      } else if (this.mode == "mesh") {
        return this.short3columns
          .filter((column) => column.key != "Organization" || this.$isPro)
          .map((column) => {
            column.title = this.$t(column.key);
            return column;
          });
      } else if (this.mode) {
        return this.shortcolumns
          .filter((column) => (column.key != "Organization" && column.key != "Gateway path" && column.key != "Action") || this.$isPro)
          .map((column) => {
            column.title = this.$t(column.key);
            return column;
          });
      } else {
        return this.columns
          .filter((column) => column.key != "Organization" || this.$isPro)
          .map((column) => {
            column.title = this.$t(column.key);
            return column;
          });
      }
    },
  },

  watch: {
    namespaces: {
      handler: function () {
        this.search();
      },

      deep: true,
    },
  },

  created() {
    if (this.embed && this.embedServices) {
      this.loading = false;
    } else {
      this.sync(true);
    }
  },

  methods: {
    remove(id) {
      this.$gql
        .mutation(`deleteServiceSync(input:{where:{id:${id}}}){id}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    detail(id, namespace) {
      this.$router.push({
        path: `/fsm/service/detail/${namespace || "default"}/${id}`,
      });
    },

    sync(init) {
      if (init) {
        this.syncLoading = 0;
        this.$gql.mutation(`fetchServices`).then(() => {
          this.syncLoading = 100;
          this.search();
          setTimeout(() => {
            this.syncLoading = -1;
          }, 1000);
        });
      }
      if (this.syncLoading < 90) {
        this.syncLoading += 10;
        setTimeout(() => {
          this.sync();
        }, 100);
      }
    },

    newItem() {
      this.$router.push({
        path: "/fsm/service/create",
      });
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }

      this.loading = true;
      if (this.embed && this.embedServices) {
        this.list = this.reset(this.embedServices);
        this.loading = false;
      } else {
        let where = { name_contains: this.key };
        let namespacesName = [];
        if (this.namespaces && this.namespaces.length > 0) {
          this.namespaces.forEach((namespace) => {
            namespacesName.push(namespace.name);
          });
          where.namespace_in = namespacesName;
        } else if (this.namespaces && this.namespaces.length == 0) {
          this.list = [];
          this.total = 0;
          this.loading = false;
          return;
        }
        let searchName = "getServices";
        if (this.mode == "mesh") {
          searchName = "servicesConnection";
        }
        this.$gql
          .query(
            `${searchName}(where: $where, start: ${this.start}, limit: ${this.pageSize}){values{id,uid,fleet{id,name},organization{id,name},namespace,name,registry{id,name},content,updated_at},aggregate{totalCount}}`,
            { 
              where 
            },
          )
          .then((res) => {
            this.list = this.reset(res.values);
            this.total = res.aggregate.totalCount;
            this.loading = false;
          });
      }
    },

    reset(list) {
      if (!list) {
        return [];
      }
      for (let i = 0; i < list.length; i++) {
        let _content = list[i].content;
        list[i].uid = _content.metadata.uid;
        list[i].name = _content.metadata.name;
        list[i].organizationName = list[i].organization
          ? list[i].organization.name
          : "-";
        list[i].registryName = list[i].registry ? list[i].registry.name : "-";
        list[i].namespace = _content.metadata.namespace || "default";
        list[i].labels = _content.metadata.labels;
        list[i].internalEndpointStr = this.contactInternalEndpoint(
          _content.internalEndpoint
            ? _content.internalEndpoint
            : { ports: [] },
        );
        list[i].externalEndpointStr = this.contactExternalEndpoint(
          _content.externalEndpoints ? _content.externalEndpoints : [],
        );
        list[i].creationTimestamp = new Date(
          list[i].updated_at,
        ).toLocaleString();
        list[i].t = "Success";
      }
      return list;
    },

    contactInternalEndpoint(endpoints) {
      let rtn = "";
      for (let i = 0; i < endpoints.ports.length; i++) {
        rtn +=
          endpoints.host +
          ":" +
          endpoints.ports[i].port +
          " " +
          endpoints.ports[i].protocol +
          "<br/>" +
          endpoints.host +
          ":" +
          endpoints.ports[i].nodePort +
          " " +
          endpoints.ports[i].protocol +
          "<br/>";
      }
      return rtn;
    },

    contactExternalEndpoint(endpoints) {
      let rtn = "";
      for (let i = 0; i < endpoints.length; i++) {
        endpoints[i].ports = endpoints[i].ports ? endpoints[i].ports : [];
        for (let j = 0; j < endpoints[i].ports.length; j++) {
          rtn +=
            endpoints[i].host +
            ":" +
            endpoints[i].ports[j].port +
            " " +
            endpoints[i].ports[j].protocol +
            "<br/>";
        }
      }
      return rtn;
    },

    addWhitelist(item) {
      this.whitelistServices.some((service, i) => {
        if (item.id === service.id) {
          this.whitelistServices.splice(i, 1);
        }
      });
      this.blacklistServices.some((service, i) => {
        if (item.id === service.id) {
          this.blacklistServices.splice(i, 1);
        }
      });

      this.embedServices.some((service, i) => {
        if (item.id === service.id) {
          this.embedServices.splice(i, 1);
        }
      });
      this.whitelistServices.push(item);
    },

    addBlacklist(item) {
      this.whitelistServices.some((service, i) => {
        if (item.id === service.id) {
          this.whitelistServices.splice(i, 1);
        }
      });
      this.blacklistServices.some((service, i) => {
        if (item.id === service.id) {
          this.blacklistServices.splice(i, 1);
        }
      });
      this.embedServices.some((service, i) => {
        if (item.id === service.id) {
          this.embedServices.splice(i, 1);
        }
      });
      this.blacklistServices.push(item);
    },

    updateGatewayPath(record) {
      this.$gql
        .mutation(
          `updateService(input: $input){service{id}}`,
          {
            input: {
              where: { id: record.id },
              data: { gatewayPath: record.gatewayPath },
            },
          },
          { input: "updateServiceInput" },
        )
        .then(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }
  .fold {
    width: calc(100% - 216px);
    display: inline-block;
  }
  .operator {
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
  .table-icon {
    width: 30px;
    height: 30px;
    margin-top: 10px;
  }
</style>
