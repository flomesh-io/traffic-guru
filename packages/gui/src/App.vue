<template>
  <a-config-provider
    :locale="locale"
    :get-popup-container="getPopupContainer"
  >
    <router-view />
  </a-config-provider>
</template>

<script>
import { enquireScreen } from "./utils/util";
import { mapState, mapMutations } from "vuex";
import themeUtil from "@/utils/themeUtil";
import { getI18nKey } from "@/utils/routerUtil";

export default {
  name: "App",
  data() {
    return {
      locale: {},
    };
  },

  computed: {
    ...mapState("setting", ["layout", "theme", "weekMode", "lang"]),
  },

  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val);
    },

    lang(val) {
      this.setHtmlTitle();
      this.setLanguage(val);
    },

    $route() {
      this.setHtmlTitle();
    },

    "theme.mode": function (val) {
      themeUtil.changeThemeColor(this.theme.color, this.getThemeMode(val));
    },

    "theme.color": function (val) {
      themeUtil.changeThemeColor(val, this.theme.mode);
    },

    layout: function () {
      window.dispatchEvent(new Event("resize"));
    },
  },

  created() {
    this.setHtmlTitle();
    this.setLanguage(this.lang);
    enquireScreen((isMobile) => this.setDevice(isMobile));
  },

  mounted() {
    this.setWeekModeTheme(this.weekMode);
  },

  methods: {
    ...mapMutations("setting", ["setDevice"]),
		
    getThemeMode(d) {
      if(d == 'light' || d == 'night'){
        return d;
      }else {
        if (window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: dark)').matches ) {
          return "night";
        }  else if (window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: light)').matches ) {
          return "light";
        }
      }
    },
		
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add("week-mode");
      } else {
        document.body.classList.remove("week-mode");
      }
    },

    setLanguage(lang) {
      this.$i18n.locale = lang;
      switch (lang) {
      case "CN":
        this.locale = require("ant-design-vue/es/locale/zh_CN").default;
        break;
      case "JP":
        this.locale = require("ant-design-vue/es/locale/ja_JP").default;
        break;
      case "US":
      default:
        this.locale = require("ant-design-vue/es/locale/en_US").default;
        break;
      }
    },

    setHtmlTitle() {
      const route = this.$route;
      const key =
        route.path === "/"
          ? "workplace.name"
          : getI18nKey(route.matched[route.matched.length - 1].path);
      document.title = process.env.VUE_APP_NAME + " | " + this.$t(key);
    },

    getPopupContainer(el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap();
      } else {
        return document.body;
      }
    },
  },
};
</script>
