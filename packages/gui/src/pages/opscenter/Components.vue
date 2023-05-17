<template>
  <PageLayout :avatar="require('@/assets/img/component2.png')">
    <template #headerContent />
    <template #extra>
      <a-tooltip
        :title="
          $t('More basic component types are under continuous development')
        "
      >
        <template #action>
          <InfoCircleOutlined class="info-circle" />
        </template>
      </a-tooltip>
      <HeadInfo
        v-permission="['fleet:create']"
        class="split-right"
        :title="$t('Create component')"
      >
        <template #body>
          <div>
            <PlusCircleTwoTone
              @click="add"
              class="font-primary icon-menu rotate-icon"
            />
          </div>
        </template>
      </HeadInfo>
    </template>
    <a-drawer
      :title="$t('Healthcheck')"
      placement="bottom"
      :closable="false"
      height="330"
      v-model:visible="visible2"
    >
      <div class="flex full">
        <div class="flex-item2">
          <MiniArea
            :colors="['#8bd4a1', '#fb9690']"
            :height="240"
            :padding="[0, 0, 0, 0]"
            :axis="false"
            :unit="$t('unitge')"
            :showy="false"
            :dv="healthcheckData.healthchecks_timer"
          />
        </div>
        <div class="a-divider-div">
          <a-divider
            type="vertical"
            class="a-divider"
          />
          <RingStatus
            class="margin-auto width-350"
            id="ServiceDetail-Healthcheck"
            :total="1000"
            :unit="$t('unitge')"
            :vals="[
              healthcheckData.healthchecks.health * 1,
              healthcheckData.healthchecks.unhealthy * 1,
            ]"
          />
        </div>
      </div>
    </a-drawer>
    <a-tabs type="card">
      <a-tab-pane
        v-for="(tabkey, i) in Object.keys(tabs)"
        :key="i"
      >
        <template #tab>
          <div class="capitalize">
            {{ tabkey }}
          </div>
        </template>
        <CardList
          :loading="loading"
          :result-empty="{ status: 404, title: $t('No data') }"
          :hide-action-title="true"
          :data-source="tabs[tabkey] || []"
          type="component"
          :actions="
            $isPro
              ? [
                {
                  icon: 'EditOutlined',
                  text: $t('edit'),
                  call: setting,
                  permission: ['fleet:update'],
                },
                /**
                {
                  icon: 'MedicineBoxOutlined',
                  text: $t('Healthcheck'),
                  call: preview,
                },*/
                {
                  icon: 'CloseOutlined',
                  text: $t('delete'),
                  call: remove,
                  permission: ['fleet:delete'],
                },
              ]
              : [
                {
                  icon: 'EditOutlined',
                  text: $t('edit'),
                  call: setting,
                  permission: ['fleet:update'],
                },
                {
                  icon: 'CloseOutlined',
                  hide: true,
                  text: $t('delete'),
                  call: remove,
                  permission: ['fleet:delete'],
                },
              ]
          "
        >
          <template #default="{ item }">
            <a-card-meta>
              <template #title>
                <span
                  v-if="(item?.type || '').toLowerCase() == 'clickhouse' || (item?.type || '').toLowerCase() == 'prometheus' || (item?.type || '').toLowerCase() == 'log'"
                  class="card-span toggle-card-item"
                >
                  <a-divider type="vertical" />
                  <a-tooltip placement="topLeft">
                    <template #title>
                      <span>{{ item.apply?$t('Actived'):$t('Click here to apply this one') }}</span>
                    </template>
                    <CaretRightOutlined
                      @click="apply(item)"
                      v-permission="['admin']"
                      v-if="!item.apply"
                      class="font-20 gray handle icon-menu-sm relative"
                    />
                    <Status
                      v-else
                      :d="{status:'success'}" 
                      class="font-primary icon-menu-sm"
                    />
                  </a-tooltip>
                </span>
                <div class="mb-3">
                  <a-badge
                    status="processing"
                    v-if="item.status == 'running' && (item.type?.toLowerCase() == 'clickhouse')"
                  />
                  <a-badge
                    status="processing"
                    color="red"
                    v-if="item.status != 'running' && (item.type?.toLowerCase() == 'clickhouse')"
                  />{{
                    item.name
                  }}
                </div>
              </template>
              <template #avatar>
                <svg
                  class="card-avatar icon"
                  aria-hidden="true"
                >
                  <use :xlink:href="'#' + icons[item.type]" />
                </svg>
              </template>
              <template #description>
                <div class="meta-content">
                  {{ $t("Component type") }}：{{ item.type }}
                </div>
              </template>
            </a-card-meta>
          </template>
        </CardList>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-model:visible="visible"
      :destroy-on-close="true"
      :title="$t('Component properties')"
      @ok="valid"
      width="90%"
      :ok-text="isEdit ? $t('Save') : $t('create')"
    >
      <a-form
        :model="payload"
        :wrapper-col="{ span: 24 }"
        ref="form"
      >
        <a-descriptions bordered>
          <a-descriptions-item
            :class="{ 'hide-row': !isEdit }"
            :label="$t('ID')"
            :span="3"
          >
            <a-input
              :disabled="isEdit"
              :placeholder="$t('unset')"
              v-model:value="payload.id"
              class="bold full"
            />
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('as')"
            :span="2"
          >
            <FormItem
              name="name"
              :rules="rules.uniqueName('fleets',{id:payload.id,type:payload.type})"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.name"
                class="width-300"
              />
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Type')"
            :span="1"
          >
            <a-select
              :disabled="isEdit"
              :placeholder="$t('Unselect')"
              class="width-200"
              v-model:value="payload.type"
              @change="renderCallback"
            >
              <a-select-option
                v-for="(item, index) in Object.keys(icons)"
                :key="index"
                :value="item"
              >
                <span>
                  <svg
                    class="icon selector-icon"
                    aria-hidden="true"
                  >
                    <use :xlink:href="'#' + icons[item]" />
                  </svg>
                  <font class="capitalize">{{ item }}</font>
                </span>
              </a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Template')"
            :span="3"
            v-if="payload.type.toLowerCase() == 'checkpoint'"
          >
            <div v-if="payload.json">
              <div class="flex">
                <div class="flex-item">
                  <div class="mt-10">
                    <a-select
                      :disabled="isEdit"
                      :placeholder="$t('unallocated')"
                      class="width-220"
                      v-model:value="payload.template"
                    >
                      <a-select-option
                        v-for="(item, index) in templates[
                          payload.type.toLowerCase()
                        ]"
                        :value="item.id"
                        :key="index"
                      >
                        <span>{{ item.name }}</span>
                      </a-select-option>
                    </a-select>
                  </div>
                </div>
              </div>
            </div>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('config')"
            :span="3"
          >
            <Json2YamlCard
              v-if="payload.type.toLowerCase() != 'log' && payload.type.toLowerCase() != 'host'"
              class="card nopd"
              :is-create="editorIsCreate"
              v-model:jsonVal="payload.content"
              @change="yamlchange"
            />
            <div v-if="payload.type.toLowerCase() == 'host'">
              <div class="flex">
                <div class="flex-item">
                  <div>
                    <label>{{ $t("Type") }} : </label>
                    <a-select
                      :placeholder="$t('unallocated')"
                      class="width-160"
                      v-model:value="payload.json.type"
                    >
                      <a-select-option value="physical">
                        <span>{{ $t("Physical Machine") }}</span>
                      </a-select-option>
                      <a-select-option value="virtual">
                        <span>{{ $t("Virtual Machine") }}</span>
                      </a-select-option>
                    </a-select>
                  </div>
                  <div class="mt-10">
                    <label> IP : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="payload.json.ip"
                      class="width-220"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="payload.type.toLowerCase() == 'log' && payload.json ">
              <div class="flex">
                <div class="flex-item">
                  <div>
                    <label>{{ $t("Log Type") }} : </label>
                    <a-select
                      :placeholder="$t('unallocated')"
                      class="width-160"
                      v-model:value="payload.json.type"
                    >
                      <a-select-option value="clickhouse">
                        <span>Clickhouse</span>
                      </a-select-option>
                    </a-select>
                  </div>
                  <div class="mt-10">
                    <label>{{ $t("Log Address") }} : </label>
                    <a-select
                      :placeholder="$t('unallocated')"
                      class="width-220"
                      v-model:value="payload.json.bind.id"
                    >
                      <a-select-option
                        v-for="(item, index) in clickhouses"
                        :key="index"
                        :value="item.id"
                      >
                        <b v-if="item.id">{{ item.name }}</b>
                        <i
                          v-if="!item.id"
                          class="gray"
                        >{{ item.name }} </i>
                        <div>
                          <div
                            v-for="(key, index2) in Object.keys(
                              item.content || [],
                            )"
                            :key="index2"
                          >
                            {{ key }}:{{ item.content[key] }}
                          </div>
                        </div>
                      </a-select-option>
                    </a-select>
                  </div>
                </div>
                <div class="flex-item">
                  <div>
                    <label>{{ $t("Log Table") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="payload.json.table"
                      class="width-220"
                    />
                  </div>
									
                  <div class="mt-10">
                    <label>{{ $t("Log Input Path") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="payload.json.input"
                      class="width-220"
                    />
                  </div>
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item
            :label="$t('Certificates')"
            v-if="
              (payload.type.toLowerCase() == 'host') &&
                payload.json
            "
            :span="3"
          >
            <IdentityList
              :certificate-size="1"
              mode="certificates"
              v-model:certificates="payload.json.tls"
              :col="2"
              :title="$t('Add Bind')"
            />
          </a-descriptions-item>
        </a-descriptions>
      </a-form>
    </a-modal>
  </PageLayout>
</template>

<script>
import _ from "lodash";
import Json2YamlCard from "@/components/card/Json2YamlCard";
import Status from "@/components/tag/Status";
import { 
  InfoCircleOutlined, 
  PlusCircleTwoTone, 
  CaretRightOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import CardList from "@/components/card/CardList";
import RingStatus from "@/components/chart/RingStatus";
import MiniArea from "@/components/chart/MiniArea";
import { Empty } from "ant-design-vue";
import IdentityList from "@/components/table/IdentityList";
import { watchHealthcheck } from "@/services/common";
import FormItem from "@/components/tool/FormItem";
import { mapState } from "vuex";

export default {
  name: "Components",
  components: {
    HeadInfo,
    PageLayout,
    CardList,
    InfoCircleOutlined,
    PlusCircleTwoTone,
    Json2YamlCard,
    RingStatus,
    Status,
    MiniArea,
    IdentityList,
    FormItem,
    CaretRightOutlined,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      isEdit: false,
      clickhouses: [],
      initContent: {},
      tabs: {},
      icons: {},
      visible: false,
      visible2: false,
      subscribes: [],
      flb: [],
      fsm: [],
      payload: {
        name: "",
        id: "",
        type: null,
        content: "",
        json: {},
      },

      editorIsCreate: true,
      workload: [],
      projects: [],
      inPreview: false,
      previewSubscribe: "",
      previewSubscribeWidth: "300",
      loading: true,
      activities: [],
      config: {},
      teams: [],
      zones: [],
      templates: {},
      healthcheckData: {
        healthchecks_timer: [],
        healthchecks: { health: 0, unhealthy: 0 },
      },

      defaultZone: null,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
  },
	
  created() {
    if (this.$isPro) {
      this.icons = {
        log: "icon-log",
        clickhouse: "icon-clickhouse",
        mysql: "icon-mysql",
        checkpoint: "icon-checkpoint",
        prometheus: "icon-prometheus",
        postgresql: "icon-PostgreSQL",
        fortio: "icon-fortio",
        host: "icon-xingzhuang",
        webConsole: "icon-fenxi",
      };
      this.initContent = {
        host: {
          ip: "localhost",
          tls: [],
          type: "virtual",
        },

        log: {
          type: "clickhouse",
          bind: {
            id: null,
          },

          table: "",
          input: "",
        },

        postgresql: {
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "default",
        },

        clickhouse: {
          host: "localhost",
          port: 3306,
          user: "user",
          password: "password",
          database: "default",
        },

        cluster: {
          type: "layer4cluster", // layer7cluster
          name: "",
        },

        aiur: {
          host: "localhost",
          port: 8080,
          username: "admin",
          password: "admin",
        },

        mysql: {
          host: "localhost",
          port: 3306,
          user: "flomesh",
          password: "flomesh",
          database: "aiur",
          charset: "UTF8_GENERAL_CI",
        },

        checkpoint: {
          reportURL: "",
          listen: "",
          interval: "",
          failures: "",
        },

        kubernetes: {
          server: "https://localhost:6443",
          dashboard_server: "https://localhost:30443",
          certificate_authority_data: "",
          user: "default",
          token: "",
        },

        prometheus: {
          host: "",
        },

        fortio: {
          host: "localhost",
          port: 3306,
          database: "fortio",
          user: "user",
          password: "password",
        },

        webConsole: {
          type: "jaeger",
          url: "",
        },
      };
    } else {
      this.icons = {
        log: "icon-log",
        prometheus: "icon-prometheus",
        clickhouse: "icon-clickhouse",
        webConsole: "icon-fenxi",
      };
      this.initContent = {
        log: {
          type: "clickhouse",
          bind: {
            id: null,
          },

          table: "",
          input: "",
        },

        clickhouse: {
          host: "localhost",
          port: 3306,
          user: "user",
          password: "password",
          database: "default",
        },

        prometheus: {
          host: "",
        },

        webConsole: {
          type: "jaeger",
          url: "",
        },
      };
    }
    this.loaddata();
  },

  methods: {
    yamlchange() {},
    add() {
      this.isEdit = false;
      this.payload = {
        name: "",
        id: "",
        type: "log",
        content: "",
        json: {},
        apply:false,
        template: null,
      };
      this.renderCallback();
      this.showModal();
    },

    renderCallback() {
      console.log(this.payload.type);
      console.log(this.initContent[this.payload.type]);
      this.payload.content = JSON.stringify(
        this.initContent[this.payload.type],
      );
      this.payload.json = this.initContent[this.payload.type];
    },

    showModal() {
      this.visible = true;
    },

    showModal2() {
      this.visible2 = true;
    },

    valid() {
      this.$refs.form
        .validateFields()
        .then(() => {
          this.handleOk();
        })
        .catch(() => {});
    },

    validLogic() {
      if (this.payload.type.toLowerCase() == "checkpoint") {
        if (!this.payload.template) {
          this.$message.error(this.$t("Please set template"), 3);
          return false;
        }
      }
      return true;
    },

    apply(item) {
      this.$gql
        .mutation(
          `updateFleet(id:${item.id}, data: $data){data{id}}`,
          {
            data: {
              apply: true
            },
          },
          {
            data: "FleetInput!",
          },
        )
        .then(() => {
          this.$message.success(this.$t("Save successfully"), 3);
          this.visible = false;
          this.loaddata();
        });
    },

    handleOk() {
      if (!this.validLogic()) {
        return;
      }

      let savedata = _.cloneDeep(this.payload);
      let content = null;
      if (savedata.type.toLowerCase() == "log") {
        content = _.cloneDeep(savedata.json);
      } else {
        content = JSON.parse(savedata.content);
      }
      delete savedata.content;
      delete savedata.json;
      delete this.payload.json;

      if (this.isEdit) {
        const whereID = savedata.id;
        delete savedata.id;
        delete savedata.template;
        this.$gql
          .mutation(
            `updateFleet(id:${whereID}, data: $data){data{id}}`,
            {
              data: {
                content,
                ...savedata,
              },
            },
            {
              data: "FleetInput!",
            }
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            this.visible = false;
            this.loaddata();
          });
      } else {
        delete savedata.id;
        savedata.apply = this.tabs[savedata.type].length == 0;
        this.$gql
          .mutation(
            `createFleet(data: $data){data{id}}`,
            {
              data: {
                content,
                ...savedata,
              },
            },
            {
              data: "FleetInput!",
            }
          )
          .then(() => {
            this.$message.success(this.$t("Created successfully"), 3);
            this.visible = false;
            this.loaddata();
          });
      }
    },

    preview(index, type, item) {
      watchHealthcheck(type, item.id).then((res) => {
        this.healthcheckData = res;
      });
      this.showModal2();
    },

    setting(index, type, item) {
      this.isEdit = true;
      this.$gql
        .query(`fleet(id: ${item.id}){data{id,attributes{name,type,apply,content}}}`)
        .then((res) => {
          this.payload = res.data;
          this.payload.content = JSON.stringify(item.content);
          this.payload.json = item.content;
          this.payload.template = item.template;
          this.payload.apply = item.apply;
          this.showModal();
        });
    },

    remove(index, type, item) {
      this.$gql
        .mutation(`deleteFleet(id: ${item.id}){data{id,attributes{name}}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata();
        });
    },

    loaddata() {
      this.$gql
        .query(`fleets(filters:{type:{eq:"log"}}){data{id,attributes{name,apply,content}}}`)
        .then((res) => {
          this.logs = res.data;
        });
      this.$gql
        .query(`fleets(filters:{type:{eq:"clickhouse"}}){data{id,attributes{name,apply,content}}}`)
        .then((res) => {
          this.clickhouses = res.data;
        });
      this.$gql
        .query(`templates(filters:{type:{eq:"checkpoint"}}){data{id,attributes{name,type,content}}}`)
        .then((res) => {
          this.templates["checkpoint"] = res.data;
        });
      this.$gql
        .query(`fleets(pagination:{limit: ${this.$DFT_LIMIT}}){data{id,attributes{name,type,content,apply,template{data{id,attributes{name}}}, status}}}`)
        .then((res) => {
          this.tabs.log = [];
          this.tabs.prometheus = [];
          this.tabs.clickhouse = [];
          if (this.$isPro) {
            this.tabs.mysql = [];
            this.tabs.postgresql = [];
            this.tabs.checkpoint = [];
            this.tabs.fortio = [];
            this.tabs.host = [];
          }
          this.tabs.webConsole = [];
          if (res.data) {
            res.data.forEach((item) => {
              if (item.template && item.template.id) {
                item.template = item.template.id;
              }
              if (this.tabs[item.type]) {
                this.tabs[item.type].push(item);
              }
            });
          }
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
  .card-avatar {
  }
  .new-btn {
    border-radius: 2px;
    width: 100%;
    height: 187px;
  }
  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: auto;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .info-circle {
    position: absolute;
    right: 5px;
    top: 20px;
  }
  .a-divider-div {
    flex: 1;
    text-align: center;
    position: relative;
  }
  .a-divider {
    height: 240px;
    position: absolute;
    top: 0px;
    left: 0;
  }
  .selector-icon {
    width: 20px;
    height: 20px;
    fill: #00adef;
    border-radius: 0;
    position: relative;
    top: 4px;
  }
</style>
