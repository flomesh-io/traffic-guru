<template>
  <a-card
    class="card nopd"
    :loading="loading"
  >
    <template #title>
      {{ $t("Meshes") }}
    </template>
    <template #extra>
      <div>
        <a-input-search
          v-model:value="key"
          @search="search()"
          class="right-search-input"
          :placeholder="$t('search')"
        />
        <a-divider
          type="vertical"
          v-permission="['mesh:create']"
        />
        <a-button
          type="link"
          shape="circle"
          @click="add"
          v-permission="['mesh:create']"
        >
          <template
            #icon
          >
            <PlusCircleTwoTone
              class="font-20 icon-menu-sm rotate-icon"
            />
          </template>
        </a-button>
      </div>
    </template>
    <div>
      <a-table
        :pagination="{
          showSizeChanger: false,
          showQuickJumper: false,
          onShowSizeChange: search,
          onChange: search,
          current: pageNo,
          pageSize: pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: total,
        }"
        :columns="dataColumns"
        :data-source="list"
        class="bg-white"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'meshName'">
            <div>
              <a
                v-if="
                  record.status.bootstrap == 'running' &&
                    record.status.controller == 'running' &&
                    record.status.injector == 'running'
                "
                href="javascript:void(0)"
                @click="detail(record.id)"
              >{{ record.meshName }}</a>
              <span v-else>{{ record.meshName }}</span>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'name'">
            <div>
              <a
                v-if="
                  record.status.bootstrap == 'running' &&
                    record.status.controller == 'running' &&
                    record.status.injector == 'running'
                "
                href="javascript:void(0)"
                @click="detail(record.id)"
              >{{ record.name }}</a>
              <span v-else>{{ record.name }}</span>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'status.bootstrap'">
            <LoadingOutlined
              v-if="record.status.bootstrap == 'pending'"
              class="font-18 font-primary"
            />
            <StopOutlined
              v-else-if="record.status.bootstrap == 'stop'"
              class="danger font-18"
            />
            <CheckCircleFilled
              v-else
              class="font-18 success"
            />
          </template>
          <template v-else-if="column.dataIndex === 'status.controller'">
            <LoadingOutlined
              v-if="record.status.controller == 'pending'"
              class="font-18 font-primary"
            />
            <StopOutlined
              v-else-if="record.status.controller == 'stop'"
              class="danger font-18"
            />
            <CheckCircleFilled
              v-else
              class="font-18 success"
            />
          </template>
          <template v-else-if="column.dataIndex === 'status.injector'">
            <LoadingOutlined
              v-if="record.status.injector == 'pending'"
              class="font-18 font-primary"
            />
            <StopOutlined
              v-else-if="record.status.injector == 'stop'"
              class="danger font-18"
            />
            <CheckCircleFilled
              v-else
              class="font-18 success"
            />
          </template>
          <template v-else-if="column.dataIndex === 'virtualServices'">
            <div v-if="record.virtualServices">
              <a-tag
                :color="virtualService.isSrcService ? 'blue' : 'default'"
                :key="index"
                v-for="(virtualService, index) in record.virtualServices"
                :closable="false"
              >
                {{ virtualService.registry?.name }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-if="
                        record.status.bootstrap == 'running' &&
                          record.status.controller == 'running' &&
                          record.status.injector == 'running'
                      "
                    >
                      <a
                        v-permission="['mesh:update']"
                        @click="detail(record.id)"
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
                        <a v-permission="['mesh:delete']">{{
                          $t("Uninstall")
                        }}</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a><MoreOutlined /></a>
              </a-dropdown>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>

  <a-modal
    v-model:visible="visible"
    :title="$t('Osm Install')"
    @ok="valid"
    width="80%"
    :ok-text="$t('Install')"
    :cancel-text="$t('cancel')"
  >
    <a-tabs
      type="card"
      v-model:activeKey="activeKey2"
      @change="tabsChange"
    >
      <a-tab-pane
        key="Primary"
        :tab="$t('Primary')"
      >
        <a-form
          v-if="payload.options && payload.options.osm"
          :model="payload"
          :wrapper-col="{ span: 24 }"
          ref="form"
        >
          <a-descriptions
            bordered
            :label-style="{ width: '280px' }"
          >
            <a-descriptions-item :span="3">
              <template #label>
                {{ $t("as") }}
              </template>
              <FormItem
                name="name"
                :rules="rules.name"
              >
                <a-input
                  :placeholder="$t('unset')"
                  v-model:value="payload.name"
                />
                <a-typography-paragraph>
                  <blockquote>
                    {{
                      $t(
                        "An 'mesh' name for the new control plane instance (Default: osm)",
                      )
                    }}
                  </blockquote>
                </a-typography-paragraph>
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item
              :label="$t('Namespace')"
              :span="2"
            >
              <EnvSelector
                :is-filter="true"
                @envChange="envChange"
              />
            </a-descriptions-item>
            <a-descriptions-item :span="1">
              <template #label>
                {{ $t("Timeout(s)") }}
                <a-tooltip
                  :title="
                    $t(
                      'Time to wait for installation and resources in a ready state, zero means no timeout (Default: 5*time.Minute)',
                    )
                  "
                >
                  <ExclamationCircleOutlined class="font-primary" />
                </a-tooltip>
              </template>
              <FormItem>
                <a-input-number
                  class="width-150"
                  :min="0"
                  :placeholder="$t('unset')"
                  v-model:value="payload.timeout"
                />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item :span="3">
              <template #label>
                {{ $t("Replica Count") }}
              </template>
              <FormItem>
                <a-input-number
                  class="width-150"
                  :min="0"
                  :placeholder="$t('unset')"
                  v-model:value="
                    payload.options.osm.osmController.replicaCount
                  "
                />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item :span="2">
              <template #label>
                {{ $t("CPU Requests") }}
              </template>
              <FormItem>
                <a-input-number
                  class="width-150"
                  :min="0"
                  :placeholder="$t('unset')"
                  v-model:value="
                    payload.options.osm.osmController.resource.requests.cpu
                  "
                />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item :span="1">
              <template #label>
                {{ $t("CPU Limits") }}
              </template>
              <FormItem>
                <a-input-number
                  class="width-150"
                  :min="0"
                  :placeholder="$t('unset')"
                  v-model:value="
                    payload.options.osm.osmController.resource.limits.cpu
                  "
                />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item :span="2">
              <template #label>
                {{ $t("Memory Requests") }}
              </template>
              <FormItem>
                <a-input
                  class="width-150"
                  :placeholder="$t('unset')"
                  v-model:value="
                    payload.options.osm.osmController.resource.requests.memory
                  "
                />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item :span="1">
              <template #label>
                {{ $t("Memory Limits") }}
              </template>
              <FormItem>
                <a-input
                  class="width-150"
                  :placeholder="$t('unset')"
                  v-model:value="
                    payload.options.osm.osmController.resource.limits.memory
                  "
                />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item
              :span="payload.options.osm.tracing.enable ? 2 : 3"
            >
              <template #label>
                {{ $t("Enable Tracing") }}
                <a-tooltip
                  :title="
                    $t(
                      'OSM allows optional deployment of Jaegar for tracing and configured via BYO scenario',
                    )
                  "
                >
                  <ExclamationCircleOutlined class="font-primary" />
                </a-tooltip>
              </template>
              <FormItem>
                <a-switch
                  v-model:checked="payload.options.osm.tracing.enable"
                />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item
              :span="1"
              v-if="payload.options.osm.tracing.enable"
            >
              <template #label>
                {{ $t("Automatic Installation Tracing") }}
                <a-tooltip
                  :title="
                    $t(
                      'Steps needed to allow an already running instance of Jaeger to integrate with your OSM control plane',
                    )
                  "
                >
                  <ExclamationCircleOutlined class="font-primary" />
                </a-tooltip>
              </template>
              <FormItem>
                <a-switch v-model:checked="payload.options.osm.deployJaeger" />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item
              :span="3"
              v-if="
                payload.options.osm.tracing.enable &&
                  !payload.options.osm.deployJaeger
              "
            >
              <template #label>
                {{ $t("Bring Your Own Tracing (BYO)") }}
              </template>
              <div class="flex">
                <div class="flex-item">
                  <FormItem>
                    <a-input
                      :placeholder="$t('Address')"
                      v-model:value="
                        payload.options.osm.tracing.address
                      "
                    />
                  </FormItem>
                </div>
                <div class="width-200">
                  <FormItem>
                    <a-input
                      :placeholder="$t('Port')"
                      v-model:value="
                        payload.options.osm.tracing.port
                      "
                    />
                  </FormItem>
                </div>
                <div class="flex-item">
                  <FormItem>
                    <a-input
                      :placeholder="$t('Endpoint')"
                      v-model:value="
                        payload.options.osm.tracing.endpoint
                      "
                    />
                  </FormItem>
                </div>
              </div>
            </a-descriptions-item>
            <a-descriptions-item :span="3">
              <template #label>
                {{ $t("Automatic Installation Metrics") }}
                <a-tooltip
                  :title="
                    $t(
                      'Steps needed to allow an already running Prometheus instance to poll the endpoints of an OSM mesh',
                    )
                  "
                >
                  <ExclamationCircleOutlined class="font-primary" />
                </a-tooltip>
              </template>
              <FormItem>
                <a-switch
                  v-model:checked="payload.options.osm.deployPrometheus"
                />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item :span="1">
              <template #label>
                {{ $t("Purge Failed Attempts") }}
                <a-tooltip
                  :title="
                    $t(
                      'Check this option, if you need to have resources auto cleaned up after failed installation attempt',
                    )
                  "
                >
                  <ExclamationCircleOutlined class="font-primary" />
                </a-tooltip>
              </template>
              <FormItem>
                <a-switch v-model:checked="payload.atomic" />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item :span="1">
              <template #label>
                {{ $t("Enforce Single Mesh") }}
                <a-tooltip
                  :title="
                    $t(
                      'Check this option, if you need to enforce only one mesh in the cluster. Once enabled, attempt to install another mesh will trigger error',
                    )
                  "
                >
                  <ExclamationCircleOutlined class="font-primary" />
                </a-tooltip>
              </template>
              <FormItem>
                <a-switch v-model:checked="payload.enforceSingleMesh" />
              </FormItem>
            </a-descriptions-item>
            <a-descriptions-item :span="1">
              <template #label>
                {{ $t("Enable Pipy Ingress") }}
                <a-tooltip
                  :title="
                    $t(
                      'Check this option to deployment of fsm control plane and gateway',
                    )
                  "
                >
                  <ExclamationCircleOutlined class="font-primary" />
                </a-tooltip>
              </template>
              <FormItem>
                <a-switch v-model:checked="payload.options.fsm.enabled" />
              </FormItem>
            </a-descriptions-item>
          </a-descriptions>
        </a-form>
      </a-tab-pane>
      <a-tab-pane
        key="Options"
        :tab="$t('Options')"
      />
    </a-tabs>
    <div :class="activeKey2 == 'Options' ? '' : 'hide-editor'">
      <Json2YamlCard
        class="mb-20"
        :is-create="editorIsCreate"
        v-model:jsonVal="json"
        @change="yamlchange"
        url="meshconfig.yaml"
      />
    </div>
  </a-modal>
</template>

<script>
import _ from "lodash";
import {
  MoreOutlined,
  StopOutlined,
  LoadingOutlined,
  PlusCircleTwoTone,
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import Json2YamlCard from "@/components/card/Json2YamlCard";
import FormItem from "@/components/tool/FormItem";
import EnvSelector from "@/components/menu/EnvSelector";

const columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Mesh Config",
    dataIndex: "configName",
  },
  {
    key: "Namespace",
    dataIndex: "namespaceName",
  },
  {
    key: "Bootstrap",
    dataIndex: "status.bootstrap",
  },
  {
    key: "Controller",
    dataIndex: "status.controller",
  },
  {
    key: "Injector",
    dataIndex: "status.injector",
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
  name: "Mesh",
  components: {
    ExclamationCircleOutlined,
    Json2YamlCard,
    CheckCircleFilled,
    LoadingOutlined,
    EnvSelector,
    FormItem,
    MoreOutlined,
    StopOutlined,
    PlusCircleTwoTone,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      isEdit: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      key: "",
      editorIsCreate: true,
      columns,
      env: null,
      activeKey2: "Primary",
      json: "{}",
      loading: true,
      namespace: null,
      list: [],
      metricsEnable: true,
      visible: false,
      payload: {
        name: "osm",
        timeout: 300,
        namespace: null,
        atomic: true,
        enforceSingleMesh: true,
        options: null,
      },

      rules: {
        name: [
          {
            required: true,
            message: "Name is required",
            whitespace: true,
            trigger: "blur",
          },
        ],
      },
    };
  },

  computed: {
    dataColumns() {
      return this.columns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },

    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  watch: {},

  created() {
    this.search();
  },

  methods: {
    envChange(data) {
      this.env = data;
      this.payload.namespace = data.namespaceId;
    },

    tabsChange() {
      if (this.activeKey2 == "Options") {
        this.setOptions();
      }
    },

    setOptions() {
      this.payload.options.osm.deployGrafana =
        this.payload.options.osm.deployPrometheus;
      let savedata = _.cloneDeep(this.payload.options);
      this.json = JSON.stringify(savedata);
    },

    yamlchange() {
      let savedata = JSON.parse(this.json);
      this.payload.options = savedata;
    },

    add() {
      this.payload = {
        name: "osm",
        timeout: 300,
        namespace: "",
        atomic: true,
        enforceSingleMesh: true,
        options: this.payload.options,
      };
      this.showModal();
    },

    showModal() {
      this.visible = true;
    },

    valid() {
      this.$refs.form
        .validateFields()
        .then(() => {
          this.handleOk();
        })
        .catch(() => {});
    },

    handleOk() {
      this.setOptions();
      let savedata = _.cloneDeep(this.payload);
      delete savedata.tracingBYO;
      let options = savedata.options;
      delete savedata.options;
      this.install(savedata, options);
    },

    install(savedata, options) {
      this.$gql
        .mutation(
          `createMesh(input: $input){mesh{id}}`,
          {
            input: {
              data: {
                name: savedata.name,
                namespace: savedata.namespace,
                atomic: savedata.atomic,
                enforceSingleMesh: savedata.enforceSingleMesh,
                options,
              },
            },
          },
          {
            input: "createMeshInput",
          },
        )
        .then(() => {
          this.visible = false;
          this.$message.success(this.$t("Created successfully"), 3);
          this.search();
        });
    },

    remove(id) {
      this.$gql
        .mutation(`deleteMesh(input:{where:{id:${id}}}){mesh{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    detail(id) {
      this.$router.push({
        path: `/fsm/mesh/detail/${id}`,
      });
    },

    MakeUrl() {
      let append = this.$REST.KUBE.append(
        this.pageSize,
        this.pageNo,
        "d,creationTimestamp",
        this.key,
      );
      return this.$REST.KUBE.encode(
        this.$REST.KUBE.MESH_CONFIG,
        append,
        this.namespace,
      );
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;

      const where = { name_contains: this.key };
      this.$gql
        .query(
          `meshesConnection(where: $where, start: ${this.start}, limit: ${this.pageSize}){values{id,config,namespace{id,registry{id,name},name},status,name,bindNamespaces{id,name},created_at},aggregate{totalCount}}`,
          { where },
        )
        .then((res) => {
          this.list = this.reset(res.values);
          this.total = res.aggregate.totalCount;
          this.loading = false;
        });
    },

    reset(list) {
      if (!list) {
        return [];
      }
      for (let i = 0; i < list.length; i++) {
        list[i].configName = list[i].config?.metadata.name;
        list[i].namespaceName = list[i].namespace?(list[i].namespace?.registry?.name+'/' +list[i].namespace?.name):"";
        list[i].creationTimestamp = new Date(
          list[i].created_at,
        ).toLocaleString();
        list[i].t = list[i].status;
      }
      return list;
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
