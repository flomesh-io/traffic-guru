<template>
  <a-form
    class="page-layout"
    :model="formState"
    :wrapper-col="{ span: 24 }"
    @finish="finish"
    @finishFailed="finishFailed"
    ref="form"
  >
    <PageHeader
      ref="pageHeader"
      :hide-breadcrumb="hideBreadcrumb"
      :hide-head="hideHead"
      :style="`margin-top: ${multiPage ? 0 : -24}px`"
      :breadcrumb="breadcrumb"
      :title="pageTitle"
      :logo="logo"
      :editable="editable"
      @changeTitle="changeTitle"
      :avatar="avatar"
    >
      <template #action>
        <slot name="action" />
      </template>
      <template #content>
        <slot name="headerContent" />
        <div v-if="!$slots.headerContent && desc">
          <p>{{ desc }}</p>
          <div
            v-if="linkList"
            class="link"
          >
            <span
              v-for="(link, index) in linkList"
              :key="index"
            >
              <a :href="link.href">{{ link.title }}</a>
            </span>
          </div>
        </div>
      </template>
      <template
        v-if="$slots.extra"
        #extra
      >
        <slot name="extra" />
      </template>
    </PageHeader>
    <div
      ref="page"
      :class="['page-content', layout, pageWidth]"
      :style="hideHead ? 'padding-top:0' : ''"
    >
      <slot />
    </div>
  </a-form>
</template>

<script>
import PageHeader from "@/components/page/header/PageHeader";
import { mapState, mapMutations } from "vuex";
import { getI18nKey } from "@/utils/routerUtil";

export default {
  name: "PageLayout",
  components: { PageHeader },
  props: [
    "formState",
    "editable",
    "desc",
    "hideBreadcrumb",
    "hideHead",
    "logo",
    "title",
    "avatar",
    "linkList",
  ],

  data() {
    return {
      page: {},
      pageHeaderHeight: 0,
    };
  },

  computed: {
    ...mapState("setting", [
      "layout",
      "multiPage",
      "pageMinHeight",
      "pageWidth",
      "customTitles",
    ]),

    pageTitle() {
      let pageTitle = this.page && this.page.title;
      return (
        this.title ||
        this.customTitle ||
        (pageTitle && this.$t(pageTitle)) ||
        this.routeName
      );
    },

    routeName() {
      const route = this.$route;
      return route.meta.displayName
        ? route.meta.displayName
        : this.$t(getI18nKey(route.matched[route.matched.length - 1].path));
    },

    breadcrumb() {
      let page = this.page;
      let breadcrumb = page && page.breadcrumb;
      if (breadcrumb) {
        let i18nBreadcrumb = [];
        breadcrumb.forEach((item) => {
          i18nBreadcrumb.push(this.$t(item));
        });
        return i18nBreadcrumb;
      } else {
        return this.getRouteBreadcrumb();
      }
    },

    marginCorrect() {
      return this.multiPage ? 24 : 0;
    },
  },

  watch: {
    $route() {
      this.page = this.$route.meta.page;
    },
  },

  updated() {
    if (!this._inactive) {
      this.updatePageHeight();
    }
  },

  finish(values) {
    this.$emit("finish", values);
  },

  finishFailed(values) {
    this.$emit("finishFailed", values);
  },

  activated() {
    this.updatePageHeight();
  },

  deactivated() {
    this.updatePageHeight(0);
  },

  mounted() {
    this.updatePageHeight();
  },

  created() {
    this.page = this.$route.meta.page;
  },

  beforeUnmount() {
    this.updatePageHeight(0);
  },

  methods: {
    ...mapMutations("setting", ["correctPageMinHeight"]),
    getRouteBreadcrumb() {
      let routes = this.$route.matched;
      let breadcrumb = [];
      routes.forEach((route) => {
        breadcrumb.push(
          route.meta.displayName
            ? route.meta.displayName
            : this.$t(getI18nKey(route.meta.fullPath || route.path)),
        );
      });
      let pageTitle = this.page && this.page.title;
      if (this.customTitle || pageTitle) {
        breadcrumb[breadcrumb.length - 1] = this.customTitle || pageTitle;
      }
      return breadcrumb;
    },

    updatePageHeight(
      newHeight = this.$refs.pageHeader.$el.offsetHeight + this.marginCorrect,
    ) {
      this.correctPageMinHeight(this.pageHeaderHeight - newHeight);
      this.pageHeaderHeight = newHeight;
    },

    changeTitle(title) {
      this.$emit("changeTitle", title);
    },
  },
};
</script>

<style lang="less">
  .page-header {
    margin: 0 -18px 0 -18px;
  }
  .link {
    /*margin-top: 16px;*/
    line-height: 24px;
    a {
      font-size: 14px;
      margin-right: 32px;
      i {
        font-size: 22px;
        margin-right: 8px;
      }
    }
  }
  .page-content {
    position: relative;
    padding: 24px 0 0;
    &.side {
    }
    &.head.fixed {
      margin: 0 auto;
      max-width: 1400px;
    }
  }
</style>
