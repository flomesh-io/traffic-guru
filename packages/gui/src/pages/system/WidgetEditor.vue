<template>
  <a-popover
    placement="left"
    trigger="click"
    class="nopd"
  >
    <template #content>
      <div style="margin: -12px -16px">
        <a-descriptions bordered>
          <a-descriptions-item
            :label="$t('Timeline')"
            :span="3"
          >
            <Timeline
              v-model:dateVal="dateVal"
              @dateChange="dateChange"
            />
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
    <div
      class="filter fullscreen header-fullscreen normal"
    >
      <a-tooltip
        placement="left"
        :title="$t('Filter')"
      >
        <FilterOutlined class="icon" />
      </a-tooltip>
    </div>
  </a-popover>
  <a-row class="bg-white">
    <a-col :span="12">
      <a-card class="left preview-card">
        <a-tabs v-model:activeKey="activeKey">
          <template #rightExtra>
            <div class="buttonGroup">
              <a-button
                type="link"
                v-if="!widgetName"
                @click="reset"
              >
                {{ $t('Reset') }}
              </a-button>
              <a-button
                type="link"
                :loading="running"
                @click="run"
              >
                {{ $t('Run') }}
              </a-button>
              <a-button
                v-permission="['widget:update']"
                v-if="!readonly && pid"
                type="primary"
                @click="validComponentForm"
              >
                {{ $t('save') }}
              </a-button>
              <a-button
                v-permission="['service:create']"
                v-else-if="!readonly && !pid"
                type="primary"
                @click="validComponentForm"
              >
                {{ $t('create') }}
              </a-button>
              <a-button
                v-else
                type="primary"
                disabled
              >
                {{ $t('Readonly') }}
              </a-button>
            </div>
          </template>
          <a-tab-pane
            key="1"
            :tab="$t('Config')"
          >
            <a-form
              :model="custom"
              :wrapper-col="{ span: 24 }"
              ref="componentForm"
            >
              <a-descriptions bordered>
                <a-descriptions-item
                  v-if="!widgetName"
                  :label="$t('as')"
                  :span="3"
                >
                  <FormItem
                    name="id"
                    :rules="rules.required"
                  >
                    <a-input
                      :disabled="!!pid"
                      :placeholder="$t('unset')"
                      v-model:value="custom.id"
                      class="bold width-200"
                    />
                  </FormItem>
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Title')"
                  :span="3"
                >
                  <FormItem
                    name="title"
                    :rules="rules.required"
                  >
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="custom.title"
                      :disabled="!!widgetName"
                      class="width-300"
                    />
                  </FormItem>
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Tag')"
                  :span="3"
                >
                  <a-select
                    :placeholder="$t('Please select')"
                    class="width-200"
                    :disabled="!!pid || !!widgetName"
                    v-model:value="custom.tag.name"
                    @change="renderCallback"
                  >
                    <a-select-option
                      v-for="(item, index) in filterBaseComponents"
                      :key="index"
                      :value="item"
                    >
                      <span>
                        <svg
                          class="icon select-svg"
                          aria-hidden="true"
                        >
                          <use
                            :xlink:href="'#' + baseComponents[item].icon"
                          />
                        </svg>
                        {{ item }}
                      </span>
                    </a-select-option>
                  </a-select>
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Cols')"
                  :content-style="{'padding':0}"
                  :span="3"
                >
                  <ColSpace v-model:col="custom.col" />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Data Source')"
                  v-if="!widgetName"
                  :span="3"
                >
                  <a-radio-group
                    class="mb-10"
                    v-model:value="custom.service.type"
                    option-type="button"
                    :options="[
                      { label: 'Rest API', value: 'rest' },
                      { label: 'Clickhouse', value: 'clickhouse' },
                      { label: 'Prometheus', value: 'prometheus' },
                    ]"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Query')"
                  v-if="!widgetName"
                  :content-style="{'padding':0}"
                  :span="3"
                >
                  <a-input-group
                    v-if="!custom.service.type || custom.service.type == 'rest'"
                    compact
                  >
                    <a-input
                      class="width-0_2"
                      default-value="http://"
                      disabled
                    />
                    <a-input
                      class="width-0_6"
                      v-model:value="custom.service.path"
                      :placeholder="$t('Path')"
                    />
                    <a-select
                      :placeholder="$t('Please select')"
                      class="width-0_2"
                      v-model:value="custom.service.method"
                    >
                      <a-select-option value="GET">
                        GET
                      </a-select-option>
                      <a-select-option value="POST">
                        POST
                      </a-select-option>
                    </a-select>
                  </a-input-group>
                  <SQLEditor
                    v-if="custom.service.type == 'clickhouse'"
                    id="clickhouseEditor"
                    v-model:value="custom.service.clickhouseSQL"
                    height="150px"
                  />
                  <SQLEditor
                    v-if="custom.service.type == 'prometheus'"
                    id="prometheusEditor"
                    v-model:value="custom.service.prometheusSQL"
                    height="150px"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  v-if="false"
                  :label="$t('Payload JSON')"
                  :content-style="{'padding':0}"
                  :span="3"
                >
                  <a-textarea
                    v-model:value="custom.service.payload"
                    :placeholder="$t('Payload')"
                    :rows="4"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Callback')"
                  :content-style="{'padding':0}"
                  :span="3"
                >
                  <JsEditor
                    id="editJsEditor"
                    :is-readonly="!!widgetName"
                    v-model:value="custom.data"
                    height="300px"
                  />
                </a-descriptions-item>
              </a-descriptions>
            </a-form>
          </a-tab-pane>
          <a-tab-pane
            v-if="!widgetName && !pid"
            key="2"
            class="pl-10 pr-10"
            :tab="$t('Samples')"
          >
            <a-list
              item-layout="horizontal"
              :data-source="samples"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <template #actions>
                    <a @click="getSamples(item.config)">{{ $t('Use') }}</a>
                  </template>
                  <a-list-item-meta description="">
                    <template #title>
                      {{ $t(item.title) }}
                    </template>
                    <template #avatar>
                      <svg
                        class="icon select-svg"
                        aria-hidden="true"
                      >
                        <use
                          :xlink:href="'#' + item.icon"
                        />
                      </svg>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card class="bg-gray preview-card">
        <a-tabs
          v-model:activeKey="rightKey"
          :destroy-inactive-tab-pane="true"
          centered
        >
          <a-tab-pane
            class="overflow-auto pt-20"
            key="1"
            :tab="$t('Preview')"
          >
            <AutoCard
              v-if="!!previewSubscribe"
              :n="previewSubscribe"
              :config="config"
              :where="where"
              :filters="{ timelineQL }"
              :ver="ver"
              class="auto-card nopd"
              :style="'width:' + previewSubscribeWidth + 'px'"
              @resp="getResp"
            />
            <a-result
              v-else
              :title="$t('No Widget')"
              :sub-title="$t('Try change the config and click run button')"
            >
              <template #icon>
                <img
                  src="../../assets/img/empty.svg"
                  style="width: 300px"
                >
              </template>
            </a-result>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="$t('Response')"
          >
            <JsonEditor
              :is-readonly="true"
              :is-json="true"
              height="800px"
              v-model:value="response"
            />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
import JsEditor from "@/components/editor/JsEditor";
import SQLEditor from "@/components/editor/SQLEditor";
import AutoCard from "@/components/card/AutoCard";
import FormItem from "@/components/tool/FormItem";
import ColSpace from "@/components/tool/ColSpace";
import { getTimelineWhere } from "@/services/clickhouse";
import { getTimelinePQL } from "@/services/prometheus";
import Timeline from "@/components/tool/Timeline";
import _ from "lodash";
import { isPro } from "@/utils/util";
import subscribe from "@/subscribe/index";
import { mapState } from "vuex";
import {
  CLICKHOUSE_SAMPLE_WIDGET,
  PROMETHEUS_SAMPLE_WIDGET,
  SAMPLE_WIDGET,
  getUserWidget,
  addUserWidget,
  editUserWidget,
} from "@/services/dashboard";

import {
  FilterOutlined,
} from "@ant-design/icons-vue";

const isFree = !isPro();
export default {
  name: "WidgetEditor",
  components: {
    JsonEditor,
    JsEditor,
    SQLEditor,
    AutoCard,
    FormItem,
    ColSpace,
    FilterOutlined,
    Timeline,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      running: false,
      response:'',
      pid:'',
      activeKey:'1',
      ver: 1,
      custom: {
        id: "",
        title: "",
        tag: { name: "Gauge" },
        service: {
          type: "rest",
          path: "",
          method: "GET",
          payload: "{}",
          clickhouseSQL: "",
          prometheusSQL: "",
        },

        col: 6,
        data: ``,
      },

      dateVal: [60, 100],
      rightKey: '1',
      readonly: false,
      icons: subscribe.baseComponents,
      visiblePre: false,
      visibleAttr: false,
      visibleEdit: false,
      flb: [],
      fsm: [],
      openapi: [],
      userWidgets: {},
      baseComponents: {},
      customComponents: [],
      system: [],
      workload: [],
      widgetName: '',
      projects: [],
      inPreview: false,
      previewSubscribe: "",
      previewSubscribeWidth: "300",
      loading: true,
      activities: [],
      config: {},
      teams: [],
      samples:[
        {icon:'icon-component',title:'Get a Rest-API sample',config:SAMPLE_WIDGET},
        {icon:'icon-component',title:'Get a Clickhouse-Query sample',config:CLICKHOUSE_SAMPLE_WIDGET},
        {icon:'icon-component',title:'Get a Prometheus-Query sample',config:PROMETHEUS_SAMPLE_WIDGET},
      ],

      isFree,
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
    filterBaseComponents() {
      return Object.keys(this.baseComponents || {}).filter(
        (key) => this.baseComponents[key].isOpen,
      );
    },

    timelineQL() {
      let rtn = getTimelinePQL(this.dateVal[0], this.dateVal[1]);
      return rtn || "";
    },
	
    where() {
      let rtn = getTimelineWhere(this.dateVal[0], this.dateVal[1]);
      return rtn || "";
    },
  },

  created() {
    this.baseComponents = subscribe.baseComponents;
    this.pid = this.$route.params.id || "";
    this.widgetName =  this.$route.params.name || "";
    if(this.pid){
      this.loaddata();
    }else if(this.widgetName){
      this.run();
    }else{
      this.resetCustom();
    }
  },

  activated() {},

  methods: {
    dateChange(data) {
      console.log(data);
    },

    getResp(d){
      setTimeout(()=>{
        this.running = false;
      },600);
      if(d.error){
        this.response = JSON.stringify({error:d.error});
      }else{
        this.response = JSON.stringify(d.data);
      }
    },
		
    normalRun() {
      if(!this.readonly){
        const root = this.widgetName.split(".")[0];
        const key1 = this.widgetName.split(".")[1];
        const key2 = this.widgetName.split(".")[2];
        this.previewSubscribe = root + "." + key1 + "." + key2;
        let config = this.getSubscribe([root, key1, key2], subscribe, 0);
        this.custom = {
          ..._.cloneDeep(config),
          data:(config.data||function(){}).toString(),
          col: subscribe[root][key1][key2].col
        }
      }
			
      this.config = {
        ..._.cloneDeep(this.custom),
        data:eval(this.custom.data),
      };
      this.previewSubscribeWidth = this.config.col * 50;
      this.readonly = true;
    },
		
    customRun() {
      const root = "custom";
      const key1 = this.custom.tag.name;
      const key2 = this.custom.id;
      this.previewSubscribe = root + "." + key1 + "." + key2;
      this.config = this.custom;
      this.previewSubscribeWidth = this.config.col * 50;
    },

    run(){
      this.rightKey = '1';
      if(this.widgetName){
        this.normalRun();
      }else{
        this.customRun();
      }
      this.ver++;
      this.running = true;
    },

    add() {
      this.resetCustom();
      this.showModalEdit();
    },
		
    getSamples(config){
      this.custom = config;
      this.activeKey="1";
      this.run();
    },

    resetCustom() {
      this.custom = {
        id: "",
        title: "",
        tag: { name: "Gauge" },
        service: {
          type: "rest",
          path: "",
          method: "GET",
          payload: "{}",
          clickhouseSQL: "",
          prometheusSQL: "",
        },

        col: 6,
        data: this.baseComponents["Gauge"].callback,
      };
    },

    showModalPre() {
      this.visiblePre = true;
    },

    showModalAttr() {
      this.visibleAttr = true;
    },

    showModalEdit() {
      this.visibleEdit = true;
      if (!this.custom.service) {
        this.custom.service = {
          type: "rest",
          path: "",
          method: "GET",
          payload: "{}",
          clickhouseSQL: "",
          prometheusSQL: "",
        };
      }
    },

    valid(custom) {
      if (this.userWidgets[custom.id]) {
        this.$message.error(
          this.$t("Duplicate widget ID name, please try another ID"),
          3,
        );
        return false;
      }
      return true;
    },

    validComponentForm() {
      this.$refs.componentForm
        .validateFields()
        .then(() => {
          this.handleOk();
        })
        .catch(() => {});
    },

    handleOk() {
      this.visibleEdit = false;
      let _custom = _.cloneDeep(this.custom);
      if (
        (!_custom.service.type || _custom.service.type == "rest") &&
        !_custom.service.path
      ) {
        delete _custom.service;
      }
      if (this.pid) {
        editUserWidget(this.pid, _custom).then(() => {
          this.$message.success(this.$t("Save successfully"), 3);
          this.loaddata();
        });
      } else if (this.valid(_custom)) {
        addUserWidget(_custom).then(() => {
          this.$message.success(this.$t("Created successfully"), 3);
          this.$closePage(this.$route);
        });
      }
    },

    getSubscribe(ary, obj, index) {
      if (ary.length > index) {
        return this.getSubscribe(ary, obj[ary[index]], ++index);
      } else {
        return obj;
      }
    },

    renderCallback() {
      if (!this.pid) {
        this.custom.data = this.baseComponents[this.custom.tag.name].callback;
      } else {
        let that = this;
        this.$confirm({
          title: this.$t("Tip"),
          content: () => this.$t("Synchronize matching callbacks?"),
          onOk() {
            that.custom.data =
              that.baseComponents[that.custom.tag.name].callback;
          },
          onCancel() {
            console.log("Cancel");
          },
          class: "test",
        });
      }
    },

    reset(){
      if(this.pid){
        this.loaddata();
      } else {
        this.resetCustom();
      }
    },

    loaddata() {
      this.readonly = false;
      getUserWidget(this.pid).then((widget) => {
        this.loading = false;
        this.custom = widget.content;
        this.run();
      });
    },
  },
};
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
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
  .svg {
    width: 50px;
    height: 50px;
    fill: #00adef;
    border-radius: 0;
  }
  .auto-card {
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
		box-shadow: 0px 0 15px 5px rgba(0,0,0,0.05);
  }
  .select-svg {
    width: 20px;
    height: 20px;
    fill: #00adef;
    border-radius: 0;
    position: relative;
    top: 4px;
  }
	.preview-card:deep(.ant-tabs-nav){
		background-color: #fff;
	}
	.preview-card{
		height: 100%;
	}
	.preview-card:deep(.ant-card-body){
		padding: 0;
	}
	.preview-card:deep(.ant-tabs-nav){
		margin: 0;
		padding: 0 0px 0 15px;
	}
	.preview-card.left{
		position: relative;
		z-index: 1;
		box-shadow: 0px 0 15px 5px rgba(0,0,0,0.05);
	}
	.buttonGroup{
		background-color: #fafafa;
	}
	.buttonGroup:deep(.ant-btn){
		height: 46px;
		border-radius: 0;
		border-width: 0;
	}
	
	.header-fullscreen.normal {
	  top: -30px;
	  right: 35px;
	  z-index: 11;
	  background-color: #fff;
	  opacity: 0.9;
	  color: #00adef;
	}
</style>
