<template>
  <a-tooltip
    v-show="!hideAdd"
    placement="top"
    :title="$t('Edit Page')"
  >
    <div
      v-permission="['dashboard:update']"
      @click="showModal"
      class="fullscreen header-fullscreen"
      :class="embed ? 'embed' : 'normal'"
    >
      <EditOutlined
        class="icon"
        v-if="!isEdit"
      />
      <CheckOutlined
        class="font-green icon"
        v-if="isEdit"
      />
    </div>
  </a-tooltip>

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
          <a-descriptions-item
            :label="$t('Namespace')"
            :span="3"
          >
            <a-switch
              size="small"
              v-model:checked="namespaceFilter"
            />
            <EnvSelector
              v-if="namespaceFilter"
              :no-all="true"
              :is-filter="true"
              @envChange="envChange"
            />
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </template>
    <div
      v-show="!hideAdd"
      class="filter fullscreen header-fullscreen"
      :class="embed ? 'embed' : 'normal'"
    >
      <a-tooltip
        placement="left"
        :title="$t('Filter')"
      >
        <FilterOutlined class="icon" />
      </a-tooltip>
    </div>
  </a-popover>
  <PageLayout
    :hide-head="hideHead"
    :avatar="avatar"
    :editable="editable"
    :title="name"
    @changeTitle="changeTitle"
  >
    <template #headerContent>
      <div>
        <div
          v-if="title"
          class="title"
        >
          {{ title }}
        </div>
        <div v-if="desc">
          {{ desc }}
        </div>
      </div>
    </template>
    <template #extra>
      <a-tooltip
        :title="
          $t(
            'You can subscribe to modules of interest on other dashboard pages',
          )
        "
      >
        <template #action>
          <InfoCircleOutlined class="info-circle" />
        </template>
      </a-tooltip>
      <HeadInfo
        :title="$t('Count of components')"
        v-if="false"
      >
        <template #body>
          <a-badge
            v-if="subscribes.length > 0"
            :count="subscribes ? subscribes.length : 0"
            class="dashboard-badge"
          />
          <span v-else>-</span>
        </template>
      </HeadInfo>
    </template>

    <a-result
      v-if="!isEdit && (loading || !subscribes || subscribes.length == 0)"
      class="mt-20"
      :title="$t('My Dashboard')"
      :sub-title="
        loading ? $t('The system is reading your preferences') + '...' : ''
      "
    >
      <template #icon>
        <img
          src="../../assets/img/empty.svg"
          style="width: 300px"
        >
      </template>
      <template
        #extra
        v-if="!loading"
      >
        <a-button
          v-permission="['dashboard:update']"
          v-if="apply"
          type="primary"
          @click="showModal"
        >
          {{ $t("Select a dashboard") }}
        </a-button>
        <a-button
          v-permission="['dashboard:update']"
          v-else
          type="primary"
          @click="showAddModal"
        >
          {{ $t("Add a component") }}
        </a-button>
      </template>
    </a-result>

    <div
      v-if="isEdit"
      class="mb-20 pt-20"
    >
      <a-typography-title
        v-if="kind == 'mesh'"
        :level="5"
        v-permission="['mesh:update']"
      >
        {{ $t("Select a prometheus") }}:
      </a-typography-title>
      <div v-if="kind == 'mesh'">
        <a-select
          v-permission="['mesh:update']"
          :placeholder="$t('unallocated')"
          class="width-200"
          v-model:value="prometheusVal"
          @change="handleProChange"
        >
          <a-select-option
            v-for="(item, index) in prometheusList"
            :key="index"
            :value="item.id"
          >
            <span v-if="item.id">{{ item.name }}</span>
          </a-select-option>
        </a-select>
        <span
          v-permission="['mesh:update']"
          class="mg-x-20"
        >{{ $t("Or") }}</span>
        <a-button
          type="primary"
          v-permission="['mesh:update']"
          @click="goComponents"
        >
          {{ $t("Add a prometheus") }}
        </a-button>
      </div>
      <a-typography-title
        v-if="apply"
        :level="5"
      >
        {{ $t("Select a dashboard") }}:
      </a-typography-title>
      <div>
        <a-select
          v-if="apply"
          v-permission="['dashboard:update']"
          :placeholder="$t('unallocated')"
          class="width-200"
          v-model:value="did"
          @change="handleApplyChange"
        >
          <a-select-option
            v-for="(item, index) in dashboards"
            :disabled="item.apply.length > 0 && apply != item.apply"
            :key="index"
            :value="item.id"
          >
            <span v-if="item.id">{{ item.name }}</span>
          </a-select-option>
        </a-select>
        <span
          v-if="apply"
          v-permission="['dashboard:update']"
          class="mg-x-20"
        >{{ $t("Or") }}</span>
        <a-button
          type="primary"
          v-permission="['dashboard:create']"
          v-if="apply"
          @click="initDashboard"
        >
          {{ $t("New Dashboard") }}
        </a-button>
        <a-button
          type="primary"
          v-permission="['dashboard:update']"
          class="ml-15"
          @click="showAddModal"
        >
          {{ $t("Add UI Component") }}
        </a-button>
      </div>
    </div>
    <a-row
      v-if="subscribes && subscribes.length > 0 && !loading && did"
      class="row-mg"
    >
      <draggable
        handle=".handle"
        v-model:list="subscribesConfigs"
        :disabled="!enabled"
        ghost-class="ghost"
        @start="dragstart"
        @end="dragend"
        @unchoose="unchoose"
        tag="transition-group"
        :component-data="{
          name: 'flip-list',
          type: 'transition',
          pull: 'clone',
        }"
      >
        <template #item="{ element }">
          <a-col
            :key="element.name"
            class="list-group-item pd-12"
            v-if="element.name != ''"
            :xl="element.config.col"
            :lg="24"
            :md="24"
            :sm="24"
            :xs="24"
          >
            <AutoCard
              :subscribes="subscribes"
              :did="did"
              :pid="pid"
              :kind="kind"
              :params="params"
              :where="where"
              :filters="{ timelineQL, namespaceQL }"
              :is-edit="isEdit"
              :apply="apply ? apply.split('.')[0] : null"
              :ismove="true"
              @subscribeChange="subscribeChange"
              :ver="'ver.' + refresh"
              :config="element.config"
              :n="element.name"
            />
          </a-col>
        </template>
      </draggable>
    </a-row>
    <a-modal
      v-model:visible="visible"
      :title="$t('Workplace Setting')"
      :footer="null"
      width="95%"
      @cancel="handleOk"
    >
      <a-tabs
        v-if="did && !inPreview"
        type="card"
        tab-position="left"
      >
        <a-tab-pane
          v-for="(tab, i) in isK8S
            ? isFree
              ? [
                { data: workload, title: 'Workload', type: 'component' },
                { data: fsm, title: 'FSM', type: 'component' },
                { data: system, title: 'Common', type: 'component' },
                { data: customComponents, title: 'Custom', type: 'custom' },
              ]
              : [
                { data: workload, title: 'Workload', type: 'component' },
                { data: flb, title: 'FLB', type: 'component' },
                { data: fsm, title: 'FSM', type: 'component' },
                { data: openapi, title: 'Open API', type: 'component' },
                { data: system, title: 'Common', type: 'component' },
                { data: customComponents, title: 'Custom', type: 'custom' },
              ]
            : isFree
              ? [
                { data: fsm, title: 'FSM', type: 'component' },
                { data: system, title: 'Common', type: 'component' },
                { data: customComponents, title: 'Custom', type: 'custom' },
              ]
              : [
                { data: flb, title: 'FLB', type: 'component' },
                { data: fsm, title: 'FSM', type: 'component' },
                { data: openapi, title: 'Open API', type: 'component' },
                { data: system, title: 'Common', type: 'component' },
                { data: customComponents, title: 'Custom', type: 'custom' },
              ]"
          :key="i"
          :tab="tab.title"
        >
          <CardList
            :loading="loading"
            :col="3"
            :data-source="tab.data.filter((d) => d.col != -1)"
            type="component"
            :actions="[
              {
                icon: 'EyeOutlined',
                text: 'Preview',
                call: preview,
                showFun: (_item) => !_item.nopreview,
              },
              {
                icon: 'PlusOutlined',
                text: 'add',
                call: addAction,
                showFun: (_item) => _item.repeat,
              },
              {
                icon: 'PlusOutlined',
                text: 'add',
                call: switchAction,
                showFun: (_item) => !_item.repeat && !_item.checked,
              },
              {
                icon: 'CheckOutlined',
                text: 'Added',
                showFun: (_item) => !_item.repeat && _item.checked,
              },
            ]"
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
                    v-if="icons[item.tag.name]"
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
      <LeftCircleOutlined
        v-if="inPreview"
        @click="previewBack"
        class="left-circle"
      />
      <AutoCard
        v-if="inPreview && previewSubscribe && previewSubscribe != ''"
        :n="previewSubscribe"
        :ver="'ver.' + refresh"
        :config="userWidgets[previewSubscribe.split('.')[2]]"
        class="auto-card"
        :style="'width:' + previewSubscribeWidth + 'px'"
      />
    </a-modal>
  </PageLayout>
</template>

<script>
import _ from "lodash";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import AutoCard from "@/components/card/AutoCard";
import { getTimelineWhere, getNamespaceWhere } from "@/services/clickhouse";
import { getTimelinePQL } from "@/services/prometheus";
import CardList from "@/components/card/CardList";
import {
  getDashboardByApply,
  getDashboardById,
  setDashboard,
  getUserWidgets,
  addDashboard,
} from "@/services/dashboard";
import Timeline from "@/components/tool/Timeline";
import EnvSelector from "@/components/menu/EnvSelector";
import { mapState, mapGetters } from "vuex";
import { isPro, isFreeKey, isK8SKey } from "@/utils/util";
import subscribeConfig from "@/subscribe/index";
import draggable from "vuedraggable";
import {
  InfoCircleOutlined,
  LeftCircleOutlined,
  CheckOutlined,
  FilterOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
const isFree = !isPro();
export default {
  name: "Dashboard",
  components: {
    HeadInfo,
    PageLayout,
    AutoCard,
    draggable,
    CardList,
    InfoCircleOutlined,
    CheckOutlined,
    FilterOutlined,
    EnvSelector,
    Timeline,
    EditOutlined,
    LeftCircleOutlined,
  },

  props: [
    "editable",
    "hideHead",
    "avatar",
    "pageId",
    "kind",
    "dashboardId",
    "title",
    "apply",
    "params",
    "desc",
    "defaultWidget",
    "embed",
    "hideAdd",
    'prometheus',
  ],

  i18n: require("@/i18n"),
  data() {
    return {
      pid: null,
      did: null,
      oid: "",
      prometheusVal: null,
      prometheusList: [],
      name: "",
      dateVal: [60, 100],
      screenWidth: document.body.clientWidth,
      timer: false,
      subscribes: [],
      refresh: 1,
      loading: true,
      isEdit: false,
      namespace: null,
      namespaceFilter: false,
      visible: false,
      dragging: false,
      enabled: true,
      dashboards: [],
      env: {},
      userWidgets: {},
      subscribesConfigs: [],
      icons: subscribeConfig.baseComponents,
      flb: [],
      fsm: [],
      openapi: [],
      workload: [],
      projects: [],
      customComponents: [],
      inPreview: false,
      previewSubscribe: "",
      previewSubscribeWidth: "300",
      activities: [],
      teams: [],
      isFree,
      isK8S: localStorage.getItem("SCHEMA_TYPE") == "k8s",
    };
  },

  computed: {
    ...mapGetters("account", ["user"]),
    ...mapState("setting", ["lang"]),
    namespaceQL() {
      let rtn = "";
      if (this.namespaceFilter) {
        rtn += this.namespace;
      }
      return rtn;
    },

    timelineQL() {
      let rtn = getTimelinePQL(this.dateVal[0], this.dateVal[1]);
      return rtn || "";
    },

    where() {
      let rtn = getTimelineWhere(this.dateVal[0], this.dateVal[1]);
      if (this.namespaceFilter) {
        rtn += getNamespaceWhere(this.namespace);
      }
      return rtn || "";
    },
  },

  watch: {
    prometheus(id) {
      this.prometheusVal = id;
    },
		
    screenWidth() {
      if (!this.timer) {
        this.timer = true;
        this.refresh = this.refresh + 1;
        let that = this;
        setTimeout(function () {
          that.timer = false;
        }, 600);
      }
    },

    subscribes() {
      const rtn = [];
      this.subscribes.forEach((name) => {
        let config = this.getConfig(name);
        if (isPro() && isK8SKey(name) && config && config.col > -1) {
          rtn.push({ name, config });
        } else if (
          !isPro() &&
          isFreeKey(name) &&
          isK8SKey(name) &&
          config &&
          config.col > -1
        ) {
          rtn.push({ name, config });
        }
      });
      this.subscribesConfigs = rtn;
    },
  },

  created() {
    this.subscribeChange(true);
    this.setEditPageData();
    if(this.kind == "mesh") {
      this.getPrometheus();
    }
  },

  mounted() {
    const that = this;
    if (window) {
      window.onresize = () => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      };
    }
    this.prometheusVal = this.prometheus;
  },

  methods: {
    getPrometheus() {
      this.$gql
        .query(`fleets(filters:{type:{eq:"prometheus"}}){data{id,attributes{name,apply,content}}}`)
        .then((res) => {
          this.prometheusList = res.data;
        });
    },
		
    dateChange(data) {
      console.log(data);
    },

    envChange(data) {
      console.log(data);
      this.env = data;
      this.namespace = data.namespace;
    },

    handleApplyChange(pid) {
      this.replace({ pid });
    },

    changeTitle(name) {
      if (!this.apply && this.name != name) {
        this.save({ name });
      }
    },

    getConfig(name) {
      let _ary = name.split(".");
      if (_ary[0] == "custom") {
        if (this.userWidgets) {
          return this.userWidgets[_ary[2]];
        } else {
          return null;
        }
      } else {
        let _temp = this.getSubscribe(_ary, null, 0);
        return _temp;
      }
    },

    showModal() {
      this.isEdit = !this.isEdit;
    },

    showAddModal() {
      this.visible = true;
      this.setEditPageData();
    },

    handleOk(e) {
      console.log(e);
      this.visible = false;
    },

    previewBack() {
      this.inPreview = false;
      this.previewSubscribe = "";
    },

    goComponents(){
      this.$router.push({
        path: "/ops-center/components",
      });
    },
		
    handleProChange(){
      this.$emit("update:prometheus",this.prometheusVal);
      this.$emit("prometheusChange",this.prometheusVal);
    },
		
    preview(index, type, item) {
      const root = type == "custom" ? type : item.root;
      const key1 = type == "custom" ? item.tag.name : item.key1;
      const key2 = type == "custom" ? item.id : item.key2;
      this.inPreview = true;
      this.previewSubscribe = root + "." + key1 + "." + key2;
      if (type == "custom") {
        this.previewSubscribeWidth = userWidgets[key2].col * 50;
      } else {
        this.previewSubscribeWidth = subscribe[root][key1][key2].col * 50;
      }
    },

    pin(key) {
      //workload.dashboard.CRONJOB
      if (typeof window !== "undefined") {
        let subscribes = _.cloneDeep(this.subscribes) || [];
        subscribes.push(key);
        this.save({ subscribes }, true);
        this.$message.success(this.$t("Added successfully"), 3);
      }
    },

    unpin(key) {
      //workload.dashboard.CRONJOB
      if (typeof window !== "undefined") {
        let subscribes = _.cloneDeep(this.subscribes);
        subscribes.forEach((n, i) => {
          if (n == key) {
            subscribes.splice(i, 1);
          }
        });
        this.save({ subscribes }, true);
        this.$message.success(this.$t("Removed successfully"), 3);
      }
    },

    switchAction(index, type, item) {
      const root = type == "custom" ? type : item.root;
      const key1 = type == "custom" ? item.tag.name : item.key1;
      const key2 = type == "custom" ? item.id : item.key2;
      item.checked = true;
      if (item.checked) {
        this.pin(root + "." + key1 + "." + key2);
      } else {
        this.unpin(root + "." + key1 + "." + key2);
      }
    },

    addAction(index, type, item) {
      const root = type == "custom" ? type : item.root;
      const key1 = type == "custom" ? item.tag.name : item.key1;
      const key2 = type == "custom" ? item.id : item.key2;
      this.pin(root + "." + key1 + "." + key2);
    },

    dragstart() {
      this.dragging = true;
    },

    dragend() {
      setTimeout(() => {
        this.subscribes = [];
        this.subscribesConfigs.forEach((node) => {
          this.subscribes.push(node.name);
        });
        this.save({ subscribes: this.subscribes });
      }, 300);
      this.dragging = false;
    },

    unchoose() {},
    getSubscribe(ary, obj, index) {
      let _obj = obj ? obj : subscribeConfig;
      if (ary.length > index) {
        return this.getSubscribe(ary, _obj[ary[index]], ++index);
      } else {
        return _obj;
      }
    },

    isOpen(root, key1, key2) {
      if (this.subscribes) {
        return this.subscribes.indexOf(root + "." + key1 + "." + key2) > -1;
      } else {
        return false;
      }
    },

    getDashboards(call) {
      this.loading = true;
      this.$gql
        .query(`dashboards{data{id,attributes{name,apply,content,updatedAt}}}`)
        .then((res) => {
          this.loading = false;
          this.dashboards = res.data;
          this.dashboards.forEach((item) => {
            item.widgets = [];
            if (item.content.widget) {
              item.widgets = item.content.widget
                .replace(/^,/g, "")
                .split(",");
            }
          });
          if (call) {
            call();
          }
        });
    },

    setUserWidgets(call) {
      getUserWidgets().then((res) => {
        this.userWidgets = {};
        res.data.forEach((widget) => {
          if (widget.content) {
            this.userWidgets[widget.content.id] = {
              ...widget.content,
              uid: widget.id,
            };
          }
        });
        this.customComponents = [];
        let customKeys = Object.keys(this.userWidgets);
        customKeys.forEach((key) => {
          this.customComponents.push({
            root: "custom",
            key1: this.userWidgets[key].tag.name,
            key2: key,
            checked: this.isOpen(
              "custom",
              this.userWidgets[key].tag.name,
              key,
            ),
            ...this.userWidgets[key],
          });
        });
        if (call) {
          call();
        }
      });
    },

    setEditPageData() {
      this.system = [];
      Object.keys(subscribeConfig.system).forEach((keys) => {
        Object.keys(subscribeConfig.system[keys]).forEach((n) => {
          this.system.push({
            root: "system",
            key1: keys,
            key2: n,
            checked: this.isOpen("system", keys, n),
            ...subscribeConfig.system[keys][n],
          });
        });
      });
      this.workload = [];
      Object.keys(subscribeConfig.workload).forEach((keys) => {
        Object.keys(subscribeConfig.workload[keys]).forEach((n) => {
          this.workload.push({
            root: "workload",
            key1: keys,
            key2: n,
            checked: this.isOpen("workload", keys, n),
            ...subscribeConfig.workload[keys][n],
          });
        });
      });
      this.flb = [];
      Object.keys(subscribeConfig.flb).forEach((keys) => {
        Object.keys(subscribeConfig.flb[keys]).forEach((n) => {
          this.flb.push({
            root: "flb",
            key1: keys,
            key2: n,
            checked: this.isOpen("flb", keys, n),
            ...subscribeConfig.flb[keys][n],
          });
        });
      });
      this.fsm = [];
      Object.keys(subscribeConfig.fsm).forEach((keys) => {
        Object.keys(subscribeConfig.fsm[keys]).forEach((n) => {
          this.fsm.push({
            root: "fsm",
            key1: keys,
            key2: n,
            checked: this.isOpen("fsm", keys, n),
            ...subscribeConfig.fsm[keys][n],
          });
        });
      });
      this.openapi = [];
      Object.keys(subscribeConfig.openapi).forEach((keys) => {
        Object.keys(subscribeConfig.openapi[keys]).forEach((n) => {
          this.openapi.push({
            root: "openapi",
            key1: keys,
            key2: n,
            checked: this.isOpen("openapi", keys, n),
            ...subscribeConfig.openapi[keys][n],
          });
        });
      });
      this.setUserWidgets(() => {
        this.getDashboards(() => {
          this.loading = false;
        });
      });
    },

    replace() {
      if (this.oid) {
        setDashboard(this.oid, { apply: "" }).then(() => {
          setDashboard(this.did, { apply: this.apply }).then(() => {
            this.subscribeChange();
          });
        });
      } else {
        setDashboard(this.did, { apply: this.apply }).then(() => {
          this.subscribeChange();
        });
      }
    },

    save(data, refresh) {
      if (this.did) {
        setDashboard(this.did, data).then(() => {
          if (refresh) {
            this.subscribeChange();
          }
        });
      } else {
        this.$message.warn(
          this.$t("Please click the right menu to bind a dashboard"),
          3,
        );
      }
    },

    initDashboard() {
      if (this.oid) {
        setDashboard(this.oid, { apply: "" }).then(() => {});
      }
      addDashboard({
        name: this.apply,
        widget: this.defaultWidget,
        apply: this.apply,
      }).then(() => {
        getDashboardByApply(this.apply).then((resAry2) => {
          if (resAry2.data.length == 0) {
            this.$message.warn(
              this.$t("Please click the right menu to bind a dashboard"),
              3,
            );
            return;
          } else {
            this.$message.success(this.$t("Init dashboard successful"), 3);
          }
          const res = resAry2.data[0];
          this.did = res.id;
          this.oid = res.id;
          this.name = res.name;
          const _subscribes = res.content.widget || this.defaultWidget;
          this.subscribes = _subscribes
            ? _subscribes.replace(/^,/g, "").split(",")
            : [];
        });
        this.getDashboards();
      });
    },

    subscribeChange(call) {
      this.loading = true;
      this.pid = this.pageId;
      this.did = this.dashboardId;
      if (this.apply) {
        getDashboardByApply(this.apply).then((resAry) => {
          if (call != true) {
            this.loading = false;
          }
          if (resAry.data.length == 0 && this.defaultWidget) {
            if (!this.embed) {
              this.initDashboard();
            }
            return;
          }
          const res = resAry.data[0];
          this.did = res.id;
          this.oid = res.id;
          this.name = res.name;
          const _subscribes = res.content.widget || this.defaultWidget;
          this.subscribes = _subscribes
            ? _subscribes.replace(/^,/g, "").split(",")
            : [];
        });
      } else {
        getDashboardById(this.did).then((res) => {
          if (call != true) {
            this.loading = false;
          }
          this.name = res.data.name;
          const _subscribes = res.data.content.widget;
          this.subscribes = _subscribes
            ? _subscribes.replace(/^,/g, "").split(",")
            : [];
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .page-layout .page-content {
    padding-top: 12px !important;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .info-circle {
    position: absolute;
    right: 5px;
    top: 20px;
  }
  .a-switch {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .svg {
    width: 50px;
    height: 50px;
    fill: #00adef;
    border-radius: 0;
  }
  .left-circle {
    font-size: 26px;
    margin-bottom: 10px;
    color: #999;
  }
  .auto-card {
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
  }
  .header-fullscreen.normal {
    top: -30px;
    right: 70px;
    z-index: 11;
    background-color: #fff;
    opacity: 0.9;
    color: #00adef;
  }
  .header-fullscreen.normal.filter {
    right: 35px;
  }
  .header-fullscreen.embed {
    top: 11px;
    right: 13px;
    z-index: 11;
    background-color: #fff;
    color: #00adef;
  }
  .header-fullscreen.embed.filter {
    right: 48px;
  }
  .dashboard-badge {
    position: relative;
    top: -3px;
  }
  .meta-content {
    height: auto;
  }
</style>
