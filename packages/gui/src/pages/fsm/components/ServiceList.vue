<template>
  <a-card
    class="card nopd"
    :tab-list="tabList"
    :active-tab-key="tabKey"
    @tabChange="onTabChange"
    :loading="loading"
  >
    <template #customTab="item">
      {{ item.tab }}
      <a-badge
        v-if="item.services > 0"
        class="ml-10"
        :count="item.services"
        :number-style="{ backgroundColor: '#00adef' }"
      />
    </template>
    <template
      v-if="mode!='registry'"
      #title
    >
      {{ title ? title : $t("Services") }}
    </template>
    <template
      v-if="embed"
      #tabBarExtraContent
    >
      <slot name="extra" />
    </template>
    <template #extra>
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
			
        :row-key="record=>record.id"
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
        :data-source="embed && embedServices !=null ? embedList : list"
        class="bg-white"
      >
        <template
          #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        >
          <div style="padding: 8px">
            <a-input
              ref="searchInput"
              :placeholder="$t('search')"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
            />
            <a-button
              type="primary"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
            >
              <template #icon>
                <SearchOutlined />
              </template>
              {{ $t('search') }}
            </a-button>
            <a-button
              size="small"
              style="width: 90px"
              @click="handleReset(clearFilters)"
            >
              {{ $t('Reset') }}
            </a-button>
          </div>
        </template>
        <template #customFilterIcon="{ filtered }">
          <SearchOutlined :style="{ color: filtered ? '#108ee9' : undefined }" />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'enabled'">
            <a-checkbox
              v-model:checked="record.enabled"
              @change="enabledChange(record)"
            />
          </template>
          <template v-else-if="column.dataIndex === 't'">
            <Status :d="{status:record.t}" />
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
          <template v-else-if="column.dataIndex === 'namespace'">
            {{ record.registryName }} / {{ record.namespace }}
          </template>
          <template v-else-if="column.dataIndex === 'name'">
            <div>
              <a
                href="javascript:void(0)"
                @click="detail(record.id, record.namespace)"
              >{{ record.name }}</a>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'organizationName'">
            <slot
              v-if="mode == 'registry'"
              name="organization"
              :item="record"
            />
            <a-tag v-else-if="record.organizationName && record.organizationName!='-'">
              {{ record.organizationName }}
            </a-tag>
            <span v-else>-</span>
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

          <template v-else-if="column.dataIndex === 'serviceExport'">
            <a-tag v-if="record.serviceExport && record.serviceExport.content">
              {{ record.serviceExport.content.path }} | {{ record.serviceExport.content.portNumber }}
            </a-tag><span v-else>-</span>
          </template>
          <template v-else-if="column.dataIndex === 'serviceImports'">
            <div v-if="record.serviceExport && record.serviceExport.serviceImports">
              <a-tag
                :key="index"
                v-for="(serviceImport, index) in record.serviceExport.serviceImports"
                :closable="false"
              >
                {{ serviceImport?.registry?.name }} / {{ serviceImport?.namespace }}
              </a-tag>
            </div>
            <span v-else>-</span>
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
                    <a-menu-item v-if="record?.registry?.type != 'eureka'">
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
  SearchOutlined,
} from "@ant-design/icons-vue";
import EnvSelector from "@/components/menu/EnvSelector";
import SyncBar from "@/components/tool/SyncBar";
import Status from "@/components/tag/Status";
const regcolumns = [
  {
    key: "Enabled",
    dataIndex: "enabled",
  },
  {
    key: "Service",
    dataIndex: "name",
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.$refs.searchInput.focus();
        }, 100);
      }
    },
  },
  {
    key: "Namespace",
    dataIndex: "namespace",
  },
  {
    key: "Gateway path",
    dataIndex: "gatewayPath",
  },
  {
    key: "Organization",
    width: 130,
    dataIndex: "organizationName",
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
    key: "Namespace",
    dataIndex: "namespace",
  },
];
const short3columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Namespace",
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
    key: "Namespace",
    dataIndex: "namespace",
  },
  {
    key: "Organization",
    width: 130,
    dataIndex: "organizationName",
  },
  {
    key: "Labels",
    width: 280,
    dataIndex: "labels",
  },
  {
    key: "Export",
    dataIndex: "serviceExport",
  },
  {
    key: "Imports",
    dataIndex: "serviceImports",
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
    SearchOutlined,
    MoreOutlined,
    CheckCircleOutlined,
    StopOutlined,
    SyncBar,
    PlusCircleTwoTone,
    EnvSelector,
    Status,
  },

  props: [
    "title",
    "selector",
    "namespace",
    "hasSearch",
    "namespaces",
    "mode",
    "embedServices",
    "embed",
    "whitelistServices",
    "blacklistServices",
    "tabList",
    "tabKey",
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
      regcolumns,
      short2columns,
      short3columns,
      loading: true,
      searchText: '',
      searchedColumn: '',
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
      } else if (this.mode == "registry") {
        return this.regcolumns
          .filter((column) => (column.key != "Organization" && column.key != "Gateway path" && column.key != "Action") || this.$isPro)
          .map((column) => {
            column.title = this.$t(column.key);
            return column;
          });
      }  else if (this.mode == "ACL") {
        console.log(this.columns
          .filter((column) => column.key != "Organization")
          .map((column) => {
            column.title = this.$t(column.key);
            return column;
          }))
        return this.columns
          .filter((column) => column.key != "Labels" && column.key != "Export" && column.key != "Imports")
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

    embedServices: {
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
      this.search();
    }
  },

  methods: {
		
    handleSearch(selectedKeys, confirm, dataIndex){
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters){
      clearFilters({ confirm: true });
      this.searchText = '';
    },

    enabledChange(d) {
      this.$emit("enabledChange",d);
    },

    onTabChange(d){
      this.$emit("update:tabKey",d);
      this.$emit("nsChange",d);
    },
		
    remove(id) {
      this.$gql
        .mutation(`deleteServiceSync(id:${id}){data{id}}`)
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
        let pagination = {
          start: this.start, 
          limit: this.pageSize
        };
        let filters = {
          name: { contains: this.key },
          deleted: { eq: false },
        };
        let namespacesName = [];
        if (this.namespaces && this.namespaces.length > 0) {
          this.namespaces.forEach((namespace) => {
            namespacesName.push(namespace.id);
          });
          filters.ns = {id: {in:namespacesName}};
        } else if (this.namespaces && this.namespaces.length == 0) {
          this.list = [];
          this.total = 0;
          this.loading = false;
          return;
        }
        if (this.namespace){
          filters.namespace = { eq: this.namespace };
        }
        if (this.selector){
          filters.selector = { eq: this.selector };
        }
        let searchName = "getServices";
        if (this.mode == "mesh") {
          searchName = "services";
        }
        this.$gql
          .query(
            `${searchName}(filters: $filters, pagination: $pagination){
							data{id,attributes{
								uid,
								serviceExport{data{id,attributes{
									content,
									serviceImports{data{id,attributes{
										registry{data{id,attributes{name}}},
										namespace
									}}}
								}}},
								fleet{data{id,attributes{name}}},
								organization{data{id,attributes{name}}},
								namespace,
								name,
								registry{data{id,attributes{name, type}}},
								content,
								updatedAt
							}},
							meta{pagination{total}}
						}`,
            { 
              filters,pagination
            },{
              filters: "ServiceFiltersInput",
              pagination: "PaginationArg",
            }
          )
          .then((res) => {
            this.list = this.reset(res.data);
            this.total = res.pagination.total;
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
          list[i].updatedAt,
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
          `updateService(id:${record.id}, data: $data){data{id}}`,
          {
            data: { gatewayPath: record.gatewayPath },
          },
          { data: "ServiceInput!" },
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
