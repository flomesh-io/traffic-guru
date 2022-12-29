<template>
  <PageLayout :avatar="require('@/assets/img/component.png')">
    <template #headerContent>
      <div>
        <div class="title">
          {{ $t("Personalized platform") }}
        </div>
        <div>
          {{
            $t(
              "You can refer to native components and customize your preferred components",
            )
          }}
        </div>
      </div>
    </template>
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
        v-permission="['widget:create']"
        class="split-right"
        :title="$t('Custom components')"
      >
        <template #body>
          <div>
            <BuildOutlined
              @click="add"
              class="font-primary icon-menu rotate-icon"
            />
          </div>
        </template>
      </HeadInfo>
    </template>
    <a-tabs type="card">
      <a-tab-pane
        v-for="(tab, i) in isFree
          ? [
            { data: system, title: $t('Common'), type: 'component' },
            { data: workload, title: $t('Workload'), type: 'component' },
            { data: fsm, title: $t('FSM'), type: 'component' },
            {
              data: customComponents,
              title: $t('Custom'),
              type: 'custom',
            },
          ]
          : [
            { data: system, title: $t('Common'), type: 'component' },
            { data: workload, title: $t('Workload'), type: 'component' },
            { data: flb, title: $t('FLB'), type: 'component' },
            { data: fsm, title: $t('FSM'), type: 'component' },
            { data: openapi, title: $t('Open API'), type: 'component' },
            { data: customComponents, title: $t('Custom'), type: 'custom' },
          ]"
        :key="i"
        :tab="tab.title"
      >
        <CardList
          :hide-action-title="true"
          :data-source="tab.data.filter((d) => d.col != -1)"
          :loading="loading"
          type="component"
          :actions="
            tab.type == 'custom'
              ? [
                { icon: 'EyeOutlined', text: $t('Preview'), call: preview },
                {
                  icon: 'SearchOutlined',
                  text: $t('Attribute'),
                  call: setting,
                },
                {
                  icon: 'EditOutlined',
                  text: $t('edit'),
                  call: edit,
                  permission: ['widget:update'],
                },
                {
                  icon: 'DeleteOutlined',
                  text: $t('delete'),
                  call: remove,
                  permission: ['widget:delete'],
                },
              ]
              : [
                { icon: 'EyeOutlined', text: $t('Preview'), call: preview },
                {
                  icon: 'SearchOutlined',
                  text: $t('Attribute'),
                  call: setting,
                },
              ]
          "
        >
          <template #default="{ item }">
            <a-card-meta>
              <template #title>
                <div class="mb-3">
                  {{ $t(item.title) }}
                </div>
              </template>
              <template #avatar>
                <svg
                  class="card-avatar icon svg"
                  aria-hidden="true"
                >
                  <use
                    :xlink:href="'#' + icons[item.tag.name].icon"
                  />
                </svg>
              </template>
              <template #description>
                <div class="meta-content">
                  {{ $t("Component type") }}：{{ item.tag.name }}
                </div>
              </template>
            </a-card-meta>
          </template>
        </CardList>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-model:visible="visiblePre"
      :title="$t('Component Preview')"
      :footer="null"
      :width="previewSubscribeWidth + 80"
    >
      <AutoCard
        v-if="inPreview && previewSubscribe && previewSubscribe != ''"
        :n="previewSubscribe"
        :config="config"
        class="auto-card nopd"
        :style="'width:' + previewSubscribeWidth + 'px'"
      />
    </a-modal>
    <a-modal
      :destroy-on-close="true"
      v-model:visible="visibleAttr"
      :title="$t('Component properties')"
      :footer="null"
      width="70%"
    >
      <a-descriptions bordered>
        <a-descriptions-item
          v-for="(item, index) in Object.keys(config)"
          :key="index"
          :label="item"
          :span="3"
        >
          <div v-if="item == 'tag'">
            {{ config[item].name }}
          </div>
          <div v-else-if="item == 'service'">
            <div v-if="!config[item].type || config[item].type == 'rest'">
              Rest API:{{ config[item].method }}{{ config[item].path }}
            </div>
            <div v-else-if="config[item].type == 'clickhouse'">
              Clickhouse Query:<br>
              <SQLEditor
                id="clickhouseEditorP"
                :value="config[item].clickhouseSQL"
                :is-readonly="true"
                height="150px"
              />
            </div>
            <div v-else-if="config[item].type == 'prometheus'">
              Prometheus Query:<br>
              <SQLEditor
                id="prometheusEditorP"
                :value="config[item].prometheusSQL"
                :is-readonly="true"
                height="150px"
              />
            </div>
          </div>
          <div v-else-if="item == 'data'">
            <JsEditor
              id="preJsEditor"
              :value="config[item]"
              :is-readonly="true"
              height="300px"
            />
          </div>
          <div v-else-if="item == 'col'">
            <ColSpace
              v-model:col="config[item]"
              :readonly="true"
            />
          </div>
          <div v-else-if="item != 'uid'">
            {{ config[item] }}
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <a-modal
      :destroy-on-close="true"
      v-model:visible="visibleEdit"
      :title="$t('Custom components')"
      @ok="validComponentForm"
      :ok-text="$t('Save')"
      width="70%"
    >
      <a-form
        :model="custom"
        :wrapper-col="{ span: 24 }"
        ref="componentForm"
      >
        <a-descriptions bordered>
          <a-descriptions-item
            :label="$t('as')"
            :span="1"
          >
            <FormItem
              name="id"
              :rules="rules.required"
            >
              <a-input
                :disabled="isEdit"
                :placeholder="$t('unset')"
                v-model:value="custom.id"
                class="bold width-200"
              />
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Title')"
            :span="2"
          >
            <FormItem
              name="title"
              :rules="rules.required"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="custom.title"
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
              :disabled="isEdit"
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
            :span="3"
          >
            <ColSpace v-model:col="custom.col" />
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Data Source')"
            :span="3"
          >
            <a-radio-group
              class="mb-10"
              v-model:value="custom.service.type"
              option-type="button"
              :options="[
                { label: 'Rest API', value: 'rest' },
                { label: 'Clickhouse Query', value: 'clickhouse' },
                { label: 'Prometheus Query', value: 'prometheus' },
              ]"
            />
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
            :span="3"
          >
            <JsEditor
              id="editJsEditor"
              v-model:value="custom.data"
              height="300px"
            />
          </a-descriptions-item>
        </a-descriptions>
        <a
          href="javascript:void(0)"
          @click="getSample"
          class="mr-20"
        >{{
          $t("Get a Rest-API sample")
        }}</a>
        <a
          href="javascript:void(0)"
          @click="getClickhouseSample"
          class="mr-20"
        >{{ $t("Get a Clickhouse-Query sample") }}</a>
        <a
          href="javascript:void(0)"
          @click="getPrometheusSample"
        >{{
          $t("Get a Prometheus-Query sample")
        }}</a>
      </a-form>
    </a-modal>
  </PageLayout>
</template>

<script>
import { InfoCircleOutlined, BuildOutlined } from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import JsEditor from "@/components/editor/JsEditor";
import SQLEditor from "@/components/editor/SQLEditor";
import AutoCard from "@/components/card/AutoCard";
import CardList from "@/components/card/CardList";
import FormItem from "@/components/tool/FormItem";
import ColSpace from "@/components/tool/ColSpace";
import _ from "lodash";
import { isPro } from "@/utils/util";
import subscribe from "@/subscribe/index";
import { mapState } from "vuex";
import {
  CLICKHOUSE_SAMPLE_WIDGET,
  PROMETHEUS_SAMPLE_WIDGET,
  SAMPLE_WIDGET,
  getUserWidgets,
  addUserWidget,
  editUserWidget,
  deleteUserWidget,
} from "@/services/dashboard";

const isFree = !isPro();
export default {
  name: "Components",
  components: {
    HeadInfo,
    PageLayout,
    JsEditor,
    SQLEditor,
    AutoCard,
    FormItem,
    CardList,
    InfoCircleOutlined,
    ColSpace,
    BuildOutlined,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      isEdit: false,
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
      projects: [],
      inPreview: false,
      previewSubscribe: "",
      previewSubscribeWidth: "300",
      loading: true,
      activities: [],
      config: {},
      teams: [],
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
  },

  created() {
    this.loaddata();
  },

  activated() {},

  methods: {
    add() {
      this.isEdit = false;
      this.resetCustom();
      this.showModalEdit();
    },

    getSample() {
      this.custom = SAMPLE_WIDGET;
    },

    getClickhouseSample() {
      this.custom = CLICKHOUSE_SAMPLE_WIDGET;
    },

    getPrometheusSample() {
      this.custom = PROMETHEUS_SAMPLE_WIDGET;
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
          this.$t("Duplicate component ID name, please try another ID"),
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
      if (_custom.uid) {
        editUserWidget(_custom.uid, _custom).then(() => {
          this.$message.success(this.$t("Save successfully"), 3);
          this.resetCustom();
          this.loaddata();
        });
      } else if (this.valid(_custom)) {
        addUserWidget(_custom).then(() => {
          this.$message.success(this.$t("Created successfully"), 3);
          this.resetCustom();
          this.loaddata();
        });
      }
    },

    remove(index, type, item) {
      const root = type == "custom" ? type : item.root;
      if (root == "custom") {
        deleteUserWidget(item.uid).then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata();
        });
      }
    },

    preview(index, type, item) {
      const root = type == "custom" ? type : item.root;
      const key1 = type == "custom" ? item.tag.name : item.key1;
      const key2 = type == "custom" ? item.id : item.key2;
      this.inPreview = true;
      this.showModalPre();
      this.previewSubscribe = root + "." + key1 + "." + key2;
      if (root == "custom") {
        this.config = this.userWidgets[key2];
        this.previewSubscribeWidth = this.config.col * 50;
      } else {
        this.previewSubscribeWidth = subscribe[root][key1][key2].col * 50;
        this.config = this.getSubscribe([root, key1, key2], subscribe, 0);
      }
    },

    setting(index, type, item) {
      const root = type == "custom" ? type : item.root;
      const key1 = type == "custom" ? item.tag.name : item.key1;
      const key2 = type == "custom" ? item.id : item.key2;
      this.inPreview = true;
      this.showModalAttr();
      this.previewSubscribe = root + "." + key1 + "." + key2;
      if (root == "custom") {
        this.config = this.userWidgets[key2];
        this.previewSubscribeWidth = this.config.col * 50;
      } else {
        this.previewSubscribeWidth = subscribe[root][key1][key2].col * 50;
        this.config = this.getSubscribe([root, key1, key2], subscribe, 0);
      }
    },

    edit(index, type, item) {
      const root = type == "custom" ? type : item.root;
      const key2 = type == "custom" ? item.tag.id : item.key2;
      this.isEdit = true;
      if (root == "custom") {
        this.custom = _.cloneDeep(this.userWidgets[key2]);
      }
      this.showModalEdit();
    },

    getSubscribe(ary, obj, index) {
      if (ary.length > index) {
        return this.getSubscribe(ary, obj[ary[index]], ++index);
      } else {
        return obj;
      }
    },

    renderCallback() {
      if (!this.isEdit) {
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

    loaddata() {
      this.baseComponents = subscribe.baseComponents;
      this.system = [];
      Object.keys(subscribe.system).forEach((keys) => {
        Object.keys(subscribe.system[keys]).forEach((n) => {
          this.system.push({
            root: "system",
            key1: keys,
            key2: n,
            checked: false,
            ...subscribe.system[keys][n],
          });
        });
      });
      this.workload = [];
      Object.keys(subscribe.workload).forEach((keys) => {
        Object.keys(subscribe.workload[keys]).forEach((n) => {
          this.workload.push({
            root: "workload",
            key1: keys,
            key2: n,
            checked: false,
            ...subscribe.workload[keys][n],
          });
        });
      });
      this.flb = [];
      Object.keys(subscribe.flb).forEach((keys) => {
        Object.keys(subscribe.flb[keys]).forEach((n) => {
          this.flb.push({
            root: "flb",
            key1: keys,
            key2: n,
            checked: false,
            ...subscribe.flb[keys][n],
          });
        });
      });
      this.fsm = [];
      Object.keys(subscribe.fsm).forEach((keys) => {
        Object.keys(subscribe.fsm[keys]).forEach((n) => {
          this.fsm.push({
            root: "fsm",
            key1: keys,
            key2: n,
            checked: false,
            ...subscribe.fsm[keys][n],
          });
        });
      });
      this.openapi = [];
      Object.keys(subscribe.openapi).forEach((keys) => {
        Object.keys(subscribe.openapi[keys]).forEach((n) => {
          this.openapi.push({
            root: "openapi",
            key1: keys,
            key2: n,
            checked: false,
            ...subscribe.openapi[keys][n],
          });
        });
      });

      getUserWidgets().then((res) => {
        this.loading = false;
        this.userWidgets = {};
        res.forEach((widget) => {
          this.userWidgets[widget.content.id] = {
            ...widget.content,
            uid: widget.id,
          };
        });

        this.customComponents = [];
        let customKeys = Object.keys(this.userWidgets);
        customKeys.forEach((key) => {
          this.customComponents.push({
            root: "custom",
            key1: this.userWidgets[key].tag.name,
            key2: key,
            checked: false,
            ...this.userWidgets[key],
          });
        });
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
  }
  .layout-selector {
    border: 1px solid #dddddd;
    border-radius: 5px;
    width: 160px;
    padding: 10px;
    cursor: pointer;
    text-align: center;
  }
  .layout-selector.highlight {
    border: 1px solid #00adef;
  }
  .layout-body {
    display: flex;
    height: 50px;
    width: 100%;
  }
  .layout-grid {
    flex: 1;
    padding: 0 7px;
  }
  .layout-item {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: #00adef;
    opacity: 0.3;
  }
  .layout-grid.highlight .layout-item {
    background-color: orange;
  }
  .select-svg {
    width: 20px;
    height: 20px;
    fill: #00adef;
    border-radius: 0;
    position: relative;
    top: 4px;
  }
</style>
