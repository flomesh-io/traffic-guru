<template>
  <a-layout
    :class="[
      'ant-layout',
      'ant-layout-has-sider',
      'admin-layout',
      'beauty-scroll',
    ]"
  >
    <WindowsMenu
      :class="[{ 'fixed-tabs': fixedTabs }]"
      @toggleCollapse="toggleCollapse"
      :theme="theme.mode"
      :menu-data="menuData"
      :collapsed="collapsed"
      :collapsible="true"
    />
    <a-layout class="admin-layout-main ant-layout beauty-scroll">
      <AdminHeader
        :class="[
          {
            'fixed-tabs': fixedTabs,
            'fixed-header': fixedHeader,
            'multi-page': multiPage,
          },
        ]"
        :style="headerStyle"
        :menu-data="headMenuData"
        :collapsed="collapsed"
        @toggleCollapse="toggleCollapse"
      />
      <a-layout-header
        :class="[
          'virtual-header',
          {
            'fixed-tabs': fixedTabs,
            'fixed-header': fixedHeader,
            'multi-page': multiPage,
          },
        ]"
        v-show="fixedHeader"
      />
      <a-layout-content
        class="admin-layout-content"
        :style="`min-height: ${minHeight}px;`"
      >
        <div class="layout-content">
          <slot />
        </div>
      </a-layout-content>
      <a-layout-footer class="pd-0">
        <PageFooter
          :link-list="footerLinks"
          :copyright="copyright"
        />
      </a-layout-footer>
      <a-tooltip
        placement="left"
        :title="lockTitle"
      >
        <div
          @click="onLockClick"
          :class="fixedTabs ? 'fullscreen-exit' : 'fullscreen'"
          class="header-fullscreen"
        >
          <FullscreenExitOutlined
            class="icon"
            v-if="fixedTabs"
          />
          <FullscreenOutlined
            class="icon"
            v-if="!fixedTabs"
          />
        </div>
      </a-tooltip>
    </a-layout>
  </a-layout>
</template>

<script>
import AdminHeader from "./header/AdminHeader";
import PageFooter from "./footer/PageFooter";
import WindowsMenu from "../components/menu/WindowsMenu";
import { mapState, mapMutations, mapGetters } from "vuex";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "AdminLayout",
  components: {
    WindowsMenu,
    PageFooter,
    AdminHeader,
    FullscreenExitOutlined,
    FullscreenOutlined,
  },

  provide() {
    return {
      adminLayout: this,
    };
  },

  data() {
    return {
      minHeight: window.innerHeight - 64 - 122,
      collapsed: false,
      affixed: false,
      showSetting: false,
      drawerOpen: false,
    };
  },

  i18n: {
    messages: {
      CN: {
        "fullscreen-exit": "全屏面板",
        fullscreen: "退出全屏",
      },

      US: {
        "fullscreen-exit": "click to fullscreen pannel",
        fullscreen: "click to exit fullscreen",
      },

      JP: {
        "fullscreen-exit": "クリックして全画面表示",
        fullscreen: "クリックして全画面表示を終了",
      },
    },
  },

  computed: {
    ...mapState("setting", [
      "isMobile",
      "theme",
      "layout",
      "footerLinks",
      "copyright",
      "fixedHeader",
      "fixedSideBar",
      "fixedTabs",
      "hideSetting",
      "multiPage",
    ]),

    ...mapGetters("setting", ["firstMenu", "subMenu", "menuData"]),
    sideMenuWidth() {
      return this.collapsed ? "80px" : "256px";
    },

    lockTitle() {
      return this.$t(this.fixedTabs ? "fullscreen" : "fullscreen-exit");
    },

    headerStyle() {
      let width =
        this.fixedHeader && this.layout !== "head" && !this.isMobile
          ? `calc(100% - ${this.sideMenuWidth})`
          : "100%";
      let position = this.fixedHeader ? "fixed" : "static";
      return `width: ${width}; position: ${position}; z-index: 12; `;
    },

    headMenuData() {
      const { layout, menuData, firstMenu } = this;
      return layout === "mix" ? firstMenu : menuData;
    },
  },

  watch: {
    $route(val) {
      this.setActivated(val);
    },

    layout() {
      this.setActivated(this.$route);
    },

    isMobile(val) {
      if (!val) {
        this.drawerOpen = false;
      }
    },
  },


  created() {
    this.affixed = this.fixedTabs;
    this.correctPageMinHeight(this.minHeight - 24);
    this.setActivated(this.$route);
  },

  beforeUnmount() {
    this.correctPageMinHeight(-this.minHeight + 24);
  },
	
  methods: {
    ...mapMutations("setting", [
      "correctPageMinHeight",
      "setActivatedFirst",
      "setFixedTabs",
    ]),

    onLockClick() {
      this.setFixedTabs(!this.fixedTabs);
      if (this.fixedTabs) {
        setTimeout(() => {
          this.affixed = true;
        }, 200);
      } else {
        this.affixed = false;
      }
    },

    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },

    onMenuSelect() {
      this.toggleCollapse();
    },

    setActivated(route) {
      if (this.layout === "mix") {
        let matched = route.matched;
        matched = matched.slice(0, matched.length - 1);
        const { firstMenu } = this;
        for (let menu of firstMenu) {
          if (
            matched.findIndex((item) => item.path === menu.fullPath) !== -1
          ) {
            this.setActivatedFirst(menu.fullPath);
            break;
          }
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .admin-layout {
    .side-menu {
      &.fixed-side {
        position: fixed;
        height: 100vh;
        left: 0;
        top: 0;
      }
    }
    .virtual-side {
      transition: all 0.2s;
    }
    .virtual-header {
      transition: all 0.2s;
      opacity: 0;
      &.fixed-tabs.multi-page:not(.fixed-header) {
        height: 0;
      }
    }
    .admin-layout-main {
      .admin-header {
        top: 0;
        right: 0;
        overflow: hidden;
        transition: all 0.2s;
        &.fixed-tabs.multi-page:not(.fixed-header) {
          height: 0;
        }
      }
    }
    .admin-layout-content {
      padding: 24px 24px 0;
      /*overflow-x: hidden;*/
      /*min-height: calc(100vh - 64px - 122px);*/
    }
    .setting {
      background-color: @primary-color;
      color: @base-bg-color;
      border-radius: 5px 0 0 5px;
      line-height: 40px;
      font-size: 22px;
      width: 40px;
      height: 40px;
      box-shadow: -2px 0 8px @shadow-color;
    }
  }
  .layout-content {
    position: relative;
    padding-top: 15px;
  }
  .header-fullscreen {
    z-index: 10;
  }
</style>
