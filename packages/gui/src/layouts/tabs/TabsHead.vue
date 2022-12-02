<template>
  <div :class="['tabs-head', layout, pageWidth]">
    <a-tabs
      type="editable-card"
      :class="[
        'tabs-container',
        layout,
        pageWidth,
        {
          affixed: affixed,
          'fixed-header': fixedHeader,
          collapsed: adminLayout.collapsed,
        },
      ]"
      :active-key="active"
      :hide-add="true"
    >
      <a-tab-pane
        v-for="page in pageList"
        :key="page.fullPath"
        :closable="false"
      >
        <template #tab>
          <div
            class="tab"
            @contextmenu="(e) => onContextmenu(page.fullPath, e)"
          >
            <LoadingOutlined
              :class="[
                'icon-sync',
                { hide: page.fullPath !== active && !page.loading },
              ]"
              v-if="page.loading"
            />
            <SyncOutlined
              :class="[
                'icon-sync',
                { hide: page.fullPath !== active && !page.loading },
              ]"
              v-if="!page.loading"
              @click="onRefresh(page)"
            />
            <div
              class="title"
              @click="onTabClick(page.fullPath)"
            >
              {{ pageName(page) }}
            </div>
            <CloseOutlined
              v-if="!page.unclose"
              @click="onClose(page.fullPath)"
              class="icon-close"
            />
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
    <div
      v-if="affixed"
      class="virtual-tabs"
    />
  </div>
</template>

<script>
import {
  LoadingOutlined,
  SyncOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import { getI18nKey } from "@/utils/routerUtil";

export default {
  name: "TabsHead",
  components: { LoadingOutlined, SyncOutlined, CloseOutlined },
  inject: ["adminLayout"],
  props: ["pageList", "active"],

  data() {
    return {
      affixed: false,
    };
  },

  computed: {
    ...mapState("setting", [
      "layout",
      "pageWidth",
      "fixedHeader",
      "fixedTabs",
      "customTitles",
    ]),

    lockTitle() {
      return this.$t(this.fixedTabs ? "unlock" : "lock");
    },
  },

  created() {},
  methods: {
    onRemoveClick() {
      this.$emit("closeAll", key);
    },

    onTabClick(key) {
      if (this.active !== key) {
        this.$emit("change", key);
      }
    },

    onClose(key) {
      this.$emit("close", key);
    },

    onRefresh(page) {
      this.$emit("refresh", page.fullPath, page);
    },

    onContextmenu(pageKey, e) {
      this.$emit("contextmenu", pageKey, e);
    },

    pageName(page) {
      const pagePath = page.fullPath.split("?")[0];
      const custom = this.customTitles.find((item) => item.path === pagePath);
      return (
        (custom && custom.title) ||
        page.title ||
        page.displayName ||
        this.$t(getI18nKey(page.newFullpath || page.keyPath))
      );
    },
  },
};
</script>

<style scoped lang="less">
  .tab {
    margin: 0 -16px;
    padding: 0 16px;
    font-size: 14px;
    user-select: none;
    transition: all 0.2s;
    .title {
      display: inline-block;
      height: 100%;
    }
    .icon-close {
      font-size: 12px;
      margin-left: 6px;
      margin-right: -4px !important;
      color: @text-color-second;
      &:hover {
        color: @text-color;
      }
    }
    .icon-sync {
      margin-left: -4px;
      color: @primary-4;
      transition: all 0.3s ease-in-out;
      &:hover {
        color: @primary-color;
      }
      font-size: 14px;
      &.hide {
        font-size: 0;
      }
    }
  }
  .tabs-head {
    margin: 0 auto;
    &.head.fixed {
      width: 1400px;
    }
  }
  .tabs-container {
    margin: -16px auto 8px;
    transition: top, left 0.2s;
    &.affixed {
      margin: 0 auto;
      top: 0px;
      padding: 8px 24px 0;
      position: fixed;
      height: 48px;
      z-index: 1;
      background-color: @layout-body-background;
      &.side,
      &.mix {
        right: 0;
        left: 256px;
        &.collapsed {
          left: 80px;
        }
      }
      &.head {
        width: inherit;
        padding: 8px 0 0;
        &.fluid {
          left: 0;
          right: 0;
          padding: 8px 24px 0;
        }
      }
      &.fixed-header {
        top: 64px;
      }
    }
  }
  .virtual-tabs {
    height: 48px;
  }
</style>
