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
                },
                {
                  icon: 'ExportOutlined',
                  hide: true,
                  text: $t('Force Push'),
                  call: forcepush,
                  permission: ['fleet:update'],
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
                  v-if="(item?.type || '').toLowerCase() == 'clickhouse' || (item?.type || '').toLowerCase() == 'log'"
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
                    v-if="item.status == 'running' && item.type?.toLowerCase() == 'pipy'"
                  />
                  <a-badge
                    status="processing"
                    color="red"
                    v-if="item.status != 'running' && item.type?.toLowerCase() == 'pipy'"
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
      width="70%"
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
            v-if="
              payload.type.toLowerCase() == 'pipy' &&
                payload.json &&
                payload.json.port != null
            "
            :label="$t('Port')"
            :span="3"
          >
            <div class="flex-item">
              <label>{{ $t("Http") }} : </label>
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.json.port"
                class="width-100"
              />
            </div>
            <div class="flex-item">
              <label>{{ $t("Https") }} : </label>
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.json.tlsport"
                class="width-100"
              />
            </div>
          </a-descriptions-item>
          <a-descriptions-item
            v-if="
              false &&
                payload.type.toLowerCase() == 'sidecar' &&
                payload.json &&
                payload.json.consul != null
            "
            :label="$t('Listen')"
            :span="3"
          >
            <div class="flex">
              <div class="flex-item">
                <label>{{ $t("Target") }} : </label>
                <a-input-number
                  v-model:value="payload.json.consul.target"
                  :min="0"
                />
              </div>
              <div class="flex-item">
                <label>{{ $t("Listen") }} : </label>
                <a-input-number
                  v-model:value="payload.json.consul.listen"
                  :min="0"
                />
              </div>
            </div>
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
              v-if="
                payload.type.toLowerCase() != 'log' &&
                  payload.type.toLowerCase() != 'host' &&
                  payload.type.toLowerCase() != 'pipy' &&
                  payload.type.toLowerCase() != 'pipy4lb' &&
                  payload.type.toLowerCase() != 'sidecar'
              "
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
            <div
              v-else-if="
                (payload.type.toLowerCase() == 'pipy' ||
                  payload.type.toLowerCase() == 'pipy4lb' ||
                  payload.type.toLowerCase() == 'sidecar') &&
                  payload.json
              "
            >
              <div class="flex">
                <div class="flex-item">
                  <div class="mt-10">
                    <label>{{ $t("Log") }} : </label>
                    <a-select
                      :placeholder="$t('unallocated')"
                      class="width-220"
                      v-model:value="payload.json.log.bind.id"
                    >
                      <a-select-option
                        v-for="(item, index) in logs"
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
                            v-show="key != 'bind' && item.content[key]"
                            :key="index2"
                          >
                            {{ key }}:{{ item.content[key] }}
                          </div>
                        </div>
                      </a-select-option>
                    </a-select>
                  </div>
                  <div
                    class="mt-10"
                    v-if="payload.type.toLowerCase() == 'pipy4lb'"
                  >
                    <label>{{ $t("Global Max Connections") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="payload.json.maxConnectionsGlobal"
                      class="width-120"
                    />
                  </div>
                  <div
                    class="mt-10"
                    v-if="payload.type.toLowerCase() == 'pipy4lb'"
                  >
                    <label>{{ $t("Default Read Timeout") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="payload.json.readTimeout"
                      class="width-120"
                    />
                  </div>
                  <div
                    class="mt-10"
                    v-if="payload.type.toLowerCase() == 'pipy4lb'"
                  >
                    <label>{{ $t("Default IDLE Timeout") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="payload.json.idleTimeout"
                      class="width-120"
                    />
                  </div>
                </div>
                <div class="flex-item">
                  <div class="mt-10">
                    <label>{{ $t("Template") }} : </label>
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
                  <div
                    class="mt-10"
                    v-if="payload.type.toLowerCase() == 'pipy4lb'"
                  >
                    <label>{{ $t("Default Max Connections") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="payload.json.maxConnections"
                      class="width-120"
                    />
                  </div>
                  <div
                    class="mt-10"
                    v-if="payload.type.toLowerCase() == 'pipy4lb'"
                  >
                    <label>{{ $t("Default Write Timeout") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="payload.json.writeTimeout"
                      class="width-120"
                    />
                  </div>
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item
            :label="$t('healthcheck')"
            :span="3"
            v-if="payload.type.toLowerCase() == 'pipy4lb'"
          >
            <div class="flex">
              <div class="flex-item">
                <div>
                  <label>{{ $t("Host") }} : </label>
                  <a-input
                    :placeholder="$t('unset')"
                    v-model:value="payload.json.healthcheck.host"
                    class="width-220"
                  />
                </div>
              </div>
              <div class="flex-item">
                <div>
                  <label>{{ $t("Port") }} : </label>
                  <a-input-number
                    :placeholder="$t('unset')"
                    v-model:value="payload.json.healthcheck.port"
                    :min="0"
                  />
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="flex-item">
                <div>
                  <label>{{ $t("Interval") }} : </label>
                  <a-input
                    :placeholder="$t('unset')"
                    v-model:value="payload.json.healthcheck.interval"
                    class="width-120"
                  />
                </div>
              </div>
              <div class="flex-item">
                <div>
                  <label>{{ $t("Failures") }} : </label>
                  <a-input-number
                    :placeholder="$t('unset')"
                    v-model:value="payload.json.healthcheck.failures"
                    :min="0"
                  />
                </div>
              </div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item
            :label="'BGP Speaker ' + $t('config')"
            :span="3"
            v-if="payload.type.toLowerCase() == 'pipy4lb'"
          >
            <JsonEditor v-model:value="payload.json.bgp" />
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Certificates')"
            v-if="
              (payload.type.toLowerCase() == 'pipy' ||
                payload.type.toLowerCase() == 'host') &&
                payload.json
            "
            :span="3"
          >
            <IdentityList
              :certificate-size="1"
              mode="certificates"
              v-model:certificates="payload.json.tls"
              :col="1"
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
import JsonEditor from "@/components/editor/JsonEditor";
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
    JsonEditor,
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
        pipy: "icon-pipy",
        pipy4lb: "icon-pipy",
        clickhouse: "icon-clickhouse",
        mysql: "icon-mysql",
        sidecar: "icon-car",
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

        pipy: {
          log: {
            bind: {
              id: null,
            },
          },

          port: 80,
          tlsport: 443,
          tls: [],
        },

        pipy4lb: {
          log: {
            type: "clickhouse",
            bind: {
              id: null,
            },

            table: "",
          },

          tls: [],
          healthcheck: {
            host: "localhost",
            port: 8888,
            failures: 3,
            interval: "5s"
          },

          maxConnections: "1000",
          readTimeout: "5s",
          writeTimeout: "5s",
          idleTimeout: "60s",
          maxConnectionsGlobal: "3000",

          bgp: '{\n  \"admin_port\": \"0.0.0.0:8080\",\n  \"bgp_nodes\": [\n    \"192.168.10.31\",\n    \"192.168.10.32\"\n  ],\n  \"debug\": false,\n  \"ipv6\": false,\n  \"asn4\": false,\n  \"afi_safi\": [\n    [\n      1,\n      1\n    ]\n  ],\n  \"bgp_addresses\": [\n    \"192.168.52.147\"\n  ],\n  \"my_asn\": 7675,\n  \"hold_time\": 180,\n  \"bgp_id\": \"192.168.52.148:179\",\n  \"withdrawn_routes\": [],\n  \"origin\": 0,\n  \"as_path\": [\n    [\n      2,\n      [\n        7675\n      ]\n    ]\n  ],\n  \"nexthop\": \"192.168.52.148\",\n  \"prefixes\": []\n}',
        },

        sidecar: {
          log: {
            type: "clickhouse",
            bind: {
              id: null,
            },

            table: "",
          },

          consul: {
            listen: "",
            target: "",
          },
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
        //pipy: 'icon-pipy',
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

        pipy: {
          log: {
            bind: {
              id: null,
            },
          },

          port: 80,
          tlsport: 443,
          tls: [],
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
      if (
        this.payload.type.toLowerCase() == "pipy" ||
        this.payload.type.toLowerCase() == "pipy4lb" ||
        this.payload.type.toLowerCase() == "sidecar"
      ) {
        if (
          !this.payload.json.log.bind.id ||
          !this.payload.template
        ) {
          this.$message.error(this.$t("Please set all config"), 3);
          return false;
        }
      } else if (this.payload.type.toLowerCase() == "checkpoint") {
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
      if (
        savedata.type.toLowerCase() == "pipy" ||
        savedata.type.toLowerCase() == "pipy4lb" ||
        savedata.type.toLowerCase() == "sidecar" ||
        savedata.type.toLowerCase() == "log"
      ) {
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

    forcepush(index, type, item) {
      this.$gql.mutation(`updatePipy(id: ${item.id})`).then(() => {
        this.$message.success(this.$t("Sync successfully"), 3);
      });
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
        .mutation(`deleteFleet(id: ${item.id}){data{id}}`)
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
        .query(`templates(filters:{type:{eq:"sidecars"}}){data{id,attributes{name,type,content}}}`)
        .then((res) => {
          this.templates["sidecar"] = res.data;
        });
      this.$gql
        .query(`templates(filters:{type:{eq:"pipy"}}){data{id,attributes{name,type,content}}}`)
        .then((res) => {
          this.templates["pipy"] = res.data;
        });
      this.$gql
        .query(`templates(filters:{type:{eq:"pipy4lb"}}){data{id,attributes{name,type,content}}}`)
        .then((res) => {
          this.templates["pipy4lb"] = res.data;
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
          if (this.$isPro) {
            this.tabs.pipy = [];
            this.tabs.pipy4lb = [];
          }
          this.tabs.prometheus = [];
          this.tabs.clickhouse = [];
          if (this.$isPro) {
            this.tabs.mysql = [];
            this.tabs.postgresql = [];
            this.tabs.checkpoint = [];
            this.tabs.sidecar = [];
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
                console.log(item, this.tabs);
                if (item.type == "pipy4lb" && !item.content.healthcheck) {
                  item.content.healthcheck = {
                    interval: "3s",
                    connectTimeout: "1s",
                    readTimeout: "1s",
                  };
                }
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
