<template>
  <a-layout-header :class="['ant-layout-header', headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <router-link
        to="/"
        :class="['logo', isMobile ? null : 'pc', headerTheme]"
      >
        <img
          width="95"
          src="@/assets/img/logo2.png"
        >
      </router-link>
      <a-divider type="vertical" />

      <div :class="['admin-header-right', headerTheme]">
        <div
          class="header-item"
          v-if="!isMobile"
        >
          <HeaderSearch @active="(val) => (searchActive = val)" />
        </div>
        <a-divider
          type="vertical"
          class="relative"
          style="top: 25px; margin: 0 3px"
        />
        <div class="header-item">
          <HeaderNotice />
        </div>
        <a-divider
          type="vertical"
          class="relative"
          style="top: 25px; margin: 0 3px"
        />
        <div class="header-item">
          <WebConsole />
        </div>
        <a-divider
          type="vertical"
          class="relative"
          style="top: 25px; margin: 0 3px"
        />
        <div class="header-item transparent">
          <ThemeSetting />
        </div>
        <a-divider
          type="vertical"
          class="relative"
          style="top: 25px; margin: 0 3px"
        />
        <a-dropdown class="header-item lang">
          <div><GlobalOutlined /> {{ langAlias }}</div>
          <template #overlay>
            <a-menu
              @click="(val) => setLang(val.key)"
              :selected-keys="[lang]"
            >
              <a-menu-item
                v-for="lang in langList"
                :key="lang.key"
              >
                {{
                  lang.key.toLowerCase() + " " + lang.name
                }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-divider
          type="vertical"
          class="relative"
          style="top: 25px; margin: 0 3px"
        />
        <div
          class="header-item"
          v-if="!isMobile"
        >
          <HeaderAvatar class="pr-20" />
        </div>
        <div class="header-item">
          <SystemSetting />
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import {
  GlobalOutlined,
} from "@ant-design/icons-vue";
import HeaderSearch from "./HeaderSearch";
import HeaderNotice from "./HeaderNotice";
import HeaderAvatar from "./HeaderAvatar";
import SystemSetting from "./SystemSetting";
import WebConsole from "./WebConsole";
import ThemeSetting from '@/components/setting/ThemeSetting'
import { mapState, mapMutations } from "vuex";

export default {
  name: "AdminHeader",
  components: {
    ThemeSetting,
    WebConsole,
    SystemSetting,
    HeaderAvatar,
    HeaderNotice,
    HeaderSearch,
    GlobalOutlined,
  },

  data() {
    return {
      langList: [
        { key: "US", name: "English", alias: "English" },
        { key: "CN", name: "简体中文", alias: "中文" },
        { key: "JP", name: "日本語", alias: "日本語" },
      ],

      searchActive: false,
    };
  },

  computed: {
    ...mapState("setting", [
      "theme",
      "isMobile",
      "layout",
      "systemName",
      "lang",
      "pageWidth",
    ]),

    headerTheme() {
      if (
        this.layout == "side" &&
        this.theme.mode == "dark" &&
        !this.isMobile
      ) {
        return "light";
      }
      return this.theme.mode;
    },

    langAlias() {
      let lang = this.langList.find((item) => item.key == this.lang);
      return lang.alias;
    },

    menuWidth() {
      const { layout, searchActive } = this;
      const headWidth = layout === "head" ? "100% - 188px" : "100%";
      const extraWidth = searchActive ? "600px" : "400px";
      return `calc(${headWidth} - ${extraWidth})`;
    },
  },

  methods: {
    toggleCollapse() {
      this.$emit("toggleCollapse");
    },

    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },

    ...mapMutations("setting", ["setLang"]),
  },
};
</script>

<style lang="less" scoped>
  @import "index";
</style>
