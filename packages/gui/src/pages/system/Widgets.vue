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
              "You can refer to native widgets and customize your preferred widgets",
            )
          }}
        </div>
      </div>
    </template>
    <template #extra>
      <a-tooltip
        :title="
          $t('More basic widget types are under continuous development')
        "
      >
        <template #action>
          <InfoCircleOutlined class="info-circle" />
        </template>
      </a-tooltip>
      <HeadInfo
        v-permission="['widget:create']"
        class="split-right"
        :title="$t('Custom widgets')"
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
                { icon: 'SearchOutlined', text: $t('Preview'), call: preview }
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
                    :xlink:href="'#' + icons[item.tag.name]?.icon"
                  />
                </svg>
              </template>
              <template #description>
                <div class="meta-content">
                  {{ $t("Widget type") }}：{{ item.tag.name }}
                </div>
              </template>
            </a-card-meta>
          </template>
        </CardList>
      </a-tab-pane>
    </a-tabs>
  </PageLayout>
</template>

<script>
import { InfoCircleOutlined, BuildOutlined } from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import CardList from "@/components/card/CardList";
import { isPro } from "@/utils/util";
import subscribe from "@/subscribe/index";
import { mapState } from "vuex";
import {
  getUserWidgets,
  deleteUserWidget,
} from "@/services/dashboard";

const isFree = !isPro();
export default {
  name: "Widgets",
  components: {
    HeadInfo,
    PageLayout,
    CardList,
    InfoCircleOutlined,
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

  methods: {

    showModalPre() {
      this.visiblePre = true;
    },

    showModalAttr() {
      this.visibleAttr = true;
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
      this.$router.push({
        path: `/system/widget/preview/${item.root}.${item.key1}.${item.key2}`,
      });
    },

    add() {
      this.$router.push({
        path: "/system/widget/creator",
      });
    },
	
    edit(index, type, item) {
      this.$router.push({
        path: "/system/widget/editor/" + item.uid,
      });
    },

    getSubscribe(ary, obj, index) {
      if (ary.length > index) {
        return this.getSubscribe(ary, obj[ary[index]], ++index);
      } else {
        return obj;
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
        res.data.forEach((widget) => {
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
  .select-svg {
    width: 20px;
    height: 20px;
    fill: #00adef;
    border-radius: 0;
    position: relative;
    top: 4px;
  }
</style>
